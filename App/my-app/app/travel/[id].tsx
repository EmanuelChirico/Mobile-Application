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

    axios.get(`http://10.56.186.198:3000/api/trips/${id}`)
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
    await axios.patch(`http://10.56.186.198:3000/api/trips/${trip?.id}/favorite`, {
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
    backgroundColor: '#FAF6F0',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 260,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2E2E',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
  },
  favorite: {
    fontSize: 28,
    paddingHorizontal: 6,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#D8A27C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  location: {
    fontSize: 16,
    color: '#5C5C5C',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B4B4B',
  },
});

