import { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
  ScrollView, ActivityIndicator,
  Alert, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

type Trip = {
  id: number;
  title: string;
  location: string;
  description: string;
  image?: string;
  isFavorite?: boolean;
  category?: string;
  date?: string;
};

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) {
      console.warn('⚠️ ID mancante o non valido!');
      setLoading(false);
      return;
    }

    axios.get(`http://192.168.0.230:3000/api/trips/${id}`)
      .then(res => {
        setTrip(res.data);
        setIsFavorite(res.data.isFavorite || false);
      })
      .catch(err => {
        Alert.alert('Errore', 'Viaggio non trovato o errore nel server.');
      })
      .finally(() => setLoading(false));
  }, [id]);

const toggleFavorite = async () => {
  const newValue = !isFavorite;
  setIsFavorite(newValue); // Aggiorna localmente

  try {
    await axios.patch(`http://192.168.0.230:3000/api/trips/${trip?.id}/favorite`, {
      isfavorite: newValue, // <-- deve combaciare col nome nel DB
    });
  } catch (err: any) {
    console.error('Errore aggiornamento preferito:', err.message);
    Alert.alert('Errore', 'Impossibile aggiornare il preferito.');
    setIsFavorite(!newValue); // Ripristina se errore
  }
};



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C19A6B" />
        <Text style={{ marginTop: 10, color: '#777' }}>Caricamento viaggio...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 18, color: '#888' }}>Viaggio non trovato.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {trip.image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${trip.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{trip.title}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Text style={styles.favorite}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {trip.category && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{trip.category}</Text>
          </View>
        )}

        <Text style={styles.location}>📍 {trip.location}</Text>

        {trip.date && (
          <Text style={styles.date}>🗓️ {new Date(trip.date).toLocaleDateString()}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descrizione</Text>
          <Text style={styles.description}>{trip.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDF6EC',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EC',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
  },
  favorite: {
    fontSize: 28,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#C19A6B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  chipText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13,
  },
});
