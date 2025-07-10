import { View, Text, FlatList, TextInput, Alert } from 'react-native';
import { useFocusEffect, Link, useRouter} from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { fetchTrips, deleteTrip } from '../../services/trips';
import { Trip } from '../../types/trip';
import TripCard from '../../components/TripCard'; 
import { getTheme } from '../../constants/Colors';      

export default function HomeScreen() {
  const [travels, setTravels] = useState<Trip[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredTravels, setFilteredTravels] = useState<Trip[]>([]);
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme ?? 'light');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchTrips().then(setTravels);
    }, [])
  );

  useEffect(() => {
    const filtered = travels.filter((trip) =>
      trip.title.toLowerCase().includes(searchText.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTravels(filtered);
  }, [searchText, travels]);

  const handleDelete = async (id: number) => {
    try {
      await deleteTrip(id);
      const updated = await fetchTrips();
      setTravels(updated);
    } catch (err) {
      Alert.alert('Errore', 'Impossibile eliminare il viaggio.');
    }
  };

    const handleEdit = (id: number) => {
        router.push(`/edit?id=${id}`);
    };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: theme.title, marginBottom: 20 }}>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TripCard trip={item} onEdit={handleEdit} onDelete={handleDelete} />
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
