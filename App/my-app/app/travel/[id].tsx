import { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
  Animated, ActivityIndicator,
  Alert, TouchableOpacity,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useColorScheme } from '../../hooks/useColorScheme';

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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [ripeti, setRipeti] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const scrollY = useState(new Animated.Value(0))[0];

  const colors = {
    light: {
      background: '#FAF6F0',
      card: '#fff',
      text: '#2E2E2E',
      title: '#2E2E2E',
      chip: '#D8A27C',
      chipText: '#fff',
      location: '#5C5C5C',
      date: '#999',
      sectionTitle: '#444',
      description: '#4B4B4B',
      loading: '#C19A6B',
      notFound: '#888',
    },
    dark: {
      background: '#181818',
      card: '#232323',
      text: '#FFD580',
      title: '#FFD580',
      chip: '#FFD580',
      chipText: '#232323',
      location: '#FFD580',
      date: '#aaa',
      sectionTitle: '#FFD580',
      description: '#FFD580',
      loading: '#FFD580',
      notFound: '#FFD580',
    },
  };
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  useEffect(() => {
    if (!id) {
      console.warn('⚠️ ID mancante o non valido!');
      setLoading(false);
      return;
    }

    axios.get(`http://192.168.1.138:3000/api/trips/${id}`)
      .then(res => {
        setTrip(res.data);
        setIsFavorite(
          res.data.isFavorite ?? res.data.isfavorite ?? res.data.favorite ?? false
        );
        setRipeti(!!(res.data.ripeti ?? res.data.ripeti ?? res.data.ripeti ?? false));
        // Calcola aspect ratio dell'immagine se presente
        if (res.data.image) {
          // Per immagini base64, serve specificare width/height manualmente
          Image.getSize(
            `data:image/jpeg;base64,${res.data.image}`,
            (width, height) => {
              setAspectRatio(width / height);
            },
            () => {
              setAspectRatio(16 / 9); // fallback
            }
          );
        }
      })
      .catch(err => {
        Alert.alert('Errore', 'Viaggio non trovato o errore nel server.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    try {
      await axios.patch(`http://192.168.1.138:3000/api/trips/${trip?.id}/favorite`, {
        isfavorite: newValue,
      });
    } catch (err: any) {
      console.error('Errore aggiornamento preferito:', err.message);
      Alert.alert('Errore', 'Impossibile aggiornare il preferito.');
      setIsFavorite(!newValue);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.loading} />
        <Text style={{ marginTop: 10, color: theme.location }}>Caricamento viaggio...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 18, color: theme.notFound }}>Viaggio non trovato.</Text>
      </View>
    );
  }


  // Funzione toggleRepeat per il refresh
  async function toggleRepeat() {
    const newValue = !ripeti;
    setRipeti(newValue);
    try {
      await axios.patch(`http://192.168.1.138:3000/api/trips/${trip?.id}/repeat`, {
        ripeti: newValue,
      });
    } catch (err) {
      setRipeti(!newValue);
      Alert.alert('Errore', 'Impossibile aggiornare lo stato "da ripetere".');
    }
  }

  return (
    <Animated.ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
    >
      {trip.image && aspectRatio && (
        <View style={{ zIndex: 1 }}>
          <Animated.Image
            source={{ uri: `data:image/jpeg;base64,${trip.image}` }}
            style={[
              styles.image,
              {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width / aspectRatio,
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [-100, 0, 100],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [1.3, 1, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={[styles.content, { zIndex: 2, backgroundColor: theme.background, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 30, minHeight: 100 }]}> 
        {/* ...existing code... */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.title }]}>{trip.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleFavorite}>
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#FF4B4B' : theme.title}
                style={styles.favorite}
              />
            </TouchableOpacity>
            <View style={{ width: 8 }} />
            <TouchableOpacity onPress={toggleRepeat}>
              <MaterialCommunityIcons
                name="refresh"
                size={28}
                color={ripeti ? '#2196F3' : theme.location}
                style={{ marginLeft: 0, marginRight: 2, opacity: 0.85 }}
              />
            </TouchableOpacity>

          </View>
        </View>

        {/* Chip categoria visivo */}
        {trip.category && (
          <View style={[styles.chip, { backgroundColor: theme.chip }]}>
            <Text style={[styles.chipText, { color: theme.chipText }]}>{trip.category}</Text>
          </View>
        )}

        {/* ...existing code... */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <MaterialCommunityIcons name="map-marker" size={18} color={theme.location} style={{ marginRight: 4 }} />
            <Text style={[styles.location, { color: theme.location, fontWeight: 'bold', maxWidth: '90%' }]} numberOfLines={1} ellipsizeMode="tail">{(trip.location || (trip.description && trip.description.split('\n')[0].replace('Zona: ', '')) || 'Zona non disponibile')}</Text>
          </View>
          {trip.date && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="calendar" size={18} color={theme.date} style={{ marginRight: 4, marginTop: 0 }} />
              <Text style={[styles.date, { color: theme.date }]}>{new Date(trip.date).toLocaleDateString()}</Text>
            </View>
          )}
        </View>

        {/* 📝 Descrizione */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name="note-text-outline" size={18} color={theme.sectionTitle} style={{ marginRight: 6 }} />
            <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Descrizione</Text>
          </View>
          <Text style={[styles.description, { color: theme.description }]}>{trip.description}</Text>
        </View>
        {/* Spazio vuoto extra in fondo per evitare che la descrizione sia attaccata al bordo */}
        <View style={{ height: Dimensions.get('window').height / 2 }} />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#eee',
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
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 13,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
    lineHeight: 20,
    alignSelf: 'center',
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});


