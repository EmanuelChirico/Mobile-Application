import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';

type Trip = {
    id: number;
    title: string;
    category?: string;
    isFavorite?: boolean;
    start_date?: string;
    end_date?: string;
};

export default function StatsScreen() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark'
        ? { background: '#181818', text: '#FFD580', card: '#232323' }
        : { background: '#FAF7ED', text: '#2C2C2C', card: '#fff' };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            axios.get(`${API_BASE_URL}/api/trips`).then(res => {
                if (isActive) setTrips(res.data);
            });
            return () => { isActive = false; };
        }, [])
    );

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/trips`).then(res => setTrips(res.data));
    }, []);

    // Statistiche
    const total = trips.length;
    const favorites = trips.filter(t => t.isFavorite).length;

    // Viaggi per categoria
    const categoryCount: Record<string, number> = {};
    trips.forEach(t => {
        const cat = t.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Durata media
    const durations = trips
        .filter(t => t.start_date && t.end_date)
        .map(t => {
            const start = new Date(t.start_date!);
            const end = new Date(t.end_date!);
            return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        });
    const avgDuration = durations.length
        ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
        : 'N/A';

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 20, textAlign: 'center' }}>
                Travel Stats
            </Text>

            <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 20, color: theme.text, marginBottom: 8 }}>Totale viaggi: <Text style={{ fontWeight: 'bold' }}>{total}</Text></Text>
                <Text style={{ fontSize: 18, color: theme.text, marginBottom: 8 }}>Viaggi preferiti: <Text style={{ fontWeight: 'bold' }}>{favorites}</Text></Text>
                <Text style={{ fontSize: 18, color: theme.text }}>Durata media: <Text style={{ fontWeight: 'bold' }}>{avgDuration} giorni</Text></Text>
            </View>

            {Object.keys(categoryCount).length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 220, marginBottom: 16 }}>
                    {Object.entries(categoryCount).map(([category, count]) => (
                        <View key={category} style={{ flex: 1, alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 30,
                                    height: (count as number) * 30, // Scala l'altezza in base al valore
                                    backgroundColor: colorScheme === 'dark' ? '#FFD580' : '#2C2C2C',
                                    borderRadius: 8,
                                    marginBottom: 6,
                                }}
                            />
                            <Text style={{ color: theme.text, fontSize: 12, textAlign: 'center' }}>{category}</Text>
                            <Text style={{ color: theme.text, fontSize: 10 }}>{count}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}