import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useColorScheme } from '../../hooks/useColorScheme';

type Trip = {
  id: number;
  title: string;
  location: string;
  image?: string;
};

export default function HomeScreen() {
  const [travels, setTravels] = useState<Trip[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredTravels, setFilteredTravels] = useState<Trip[]>([]);
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      background: '#FAF7ED',
      card: '#fff',
      text: '#3A2F20',
      title: '#6B4F2C',
      border: '#ddd',
      placeholder: '#999',
      delete: '#C94C4C',
      location: '#777',
      shadow: '#000',
    },
    dark: {
      background: '#181818',
      card: '#232323',
      text: '#F5F5F5',
      title: '#FFD580',
      border: '#333',
      placeholder: '#aaa',
      delete: '#C94C4C',
      location: '#aaa',
      shadow: '#000',
    },
  };
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  const fetchTravels = async () => {
    try {
      const res = await axios.get('http://192.168.1.138:3000/api/trips');
      const data = res.data.map((trip: any) => ({
        id: trip.id,
        title: trip.title,
        location: trip.description || 'Unknown location',
        image: trip.image || null,
      }));
      setTravels(data);
    } catch (err) {
      console.error('Errore nel caricamento dei viaggi:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTravels();
    }, [])
  );

  useEffect(() => {
    const filtered = travels.filter((trip) =>
      trip.title.toLowerCase().includes(searchText.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTravels(filtered);
  }, [searchText, travels]);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo viaggio?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.1.138:3000/api/trips/${id}`);
              fetchTravels();
            } catch (err) {
              console.error('Errore durante eliminazione:', err);
              Alert.alert('Errore', 'Impossibile eliminare il viaggio.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.title,
        marginBottom: 20,
      }}>
        Your Travel Diary
      </Text>

      <TextInput
        placeholder="Search travels..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          backgroundColor: theme.card,
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          fontSize: 16,
          borderColor: theme.border,
          borderWidth: 1,
          color: theme.text,
        }}
        placeholderTextColor={theme.placeholder}
      />

      <FlatList
        data={filteredTravels}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: theme.card,
            marginBottom: 16,
            borderRadius: 16,
            padding: 12,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <Link href={{ pathname: "/travel/[id]", params: { id: item.id.toString() } }} asChild>
              <TouchableOpacity>
                {item.image && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{item.title}</Text>
                <Text style={{ color: theme.location }}>{item.location}</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={{
                alignSelf: 'flex-end',
                marginTop: 10,
                padding: 6,
                paddingHorizontal: 12,
                backgroundColor: theme.delete,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.location, marginTop: 50 }}>
            No travels found
          </Text>
        }
      />
    </View>
  );
}
