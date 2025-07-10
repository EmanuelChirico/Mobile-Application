import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';
import { useFocusEffect } from '@react-navigation/native';

type Trip = {
    id: number;
    title: string;
    location: string;
};

type TripWithCoords = Trip & { latitude: number; longitude: number };

export default function MapScreen() {
    const [trips, setTrips] = useState<TripWithCoords[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            async function fetchTripsAndCoords() {
                setLoading(true);
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/trips`);
                    const trips: Trip[] = res.data;

                    const withCoords: TripWithCoords[] = [];
                    for (const trip of trips) {
                        if (!trip.location) continue;
                        try {
                            const geo = await axios.get('https://nominatim.openstreetmap.org/search', {
                                params: {
                                    q: trip.location,
                                    format: 'json',
                                    limit: 1,
                                },
                                headers: {
                                    'User-Agent': 'MobileApp/1.0 (email@email.com)',
                                    'Accept-Language': 'it',
                                },
                            });
                            console.log('Geocoding', trip.location, geo.data);

                            if (geo.data.length > 0) {
                                withCoords.push({
                                    ...trip,
                                    latitude: parseFloat(geo.data[0].lat),
                                    longitude: parseFloat(geo.data[0].lon),
                                });
                            }
                        } catch (e) {
                            console.log('Errore geocoding', trip.location, e);
                        }
                    }
                    if (isActive) setTrips(withCoords);
                } catch (err) {
                    Alert.alert('Errore', 'Impossibile caricare i viaggi o le coordinate.');
                } finally {
                    if (isActive) setLoading(false);
                }
            }
            fetchTripsAndCoords();
            return () => { isActive = false; };
        }, [])
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Caricamento mappa...</Text>
            </View>
        );
    }

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: trips[0]?.latitude || 41.9,
                longitude: trips[0]?.longitude || 12.5,
                latitudeDelta: 30,
                longitudeDelta: 30,
            }}
        >
            {trips.map(trip => (
                <Marker
                    key={trip.id}
                    coordinate={{ latitude: trip.latitude, longitude: trip.longitude }}
                    title={trip.title}
                    description={trip.location}
                />
            ))}
        </MapView>
    );
}