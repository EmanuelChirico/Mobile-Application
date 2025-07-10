import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Trip } from '../types/trip';
import { getTheme } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

type Props = {
  trip: Trip;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TripCard({ trip, onEdit, onDelete }: Props) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme ?? 'light');

  return (
    <View style={{
      backgroundColor: trip.isFavorite ? '#fd7266' : theme.card,
      marginBottom: 16,
      borderRadius: 16,
      padding: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <Link href={{ pathname: "/travel/[id]", params: { id: trip.id.toString() } }} asChild>
        <TouchableOpacity>
          {trip.image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${trip.image}` }}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 12,
                marginBottom: 8,
              }}
              resizeMode="cover"
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{trip.title}</Text>
          <Text style={{ color: theme.location }}>{trip.location}</Text>
        </TouchableOpacity>
      </Link>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
            <TouchableOpacity
                onPress={() => onEdit(trip.id)}
                style={{
                    padding: 6,
                    paddingHorizontal: 12,
                    backgroundColor: theme.edit,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 4 }}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onDelete(trip.id)}
                style={{
                    padding: 6,
                    paddingHorizontal: 12,
                    backgroundColor: theme.delete,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 4 }}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}
