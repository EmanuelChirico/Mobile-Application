import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const travels: { id: string; title: string; location: string }[] = [];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, 
    padding: 30, 
    backgroundColor: '#EDE8D0' 
    }}>
      <Text style={{
        fontSize: 24, 
        fontWeight: 'bold',
        textAlign : 'center',
        fontFamily : 'helvetica',
        marginBottom: 20,
        }}>Your Travel diary</Text>
      <FlatList
        data={travels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/travel/${item.id}`} asChild>
            <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text>{item.location}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text>Still no travels added</Text>}
      />
      <Link
        href="/add"
        style={{
          position: 'absolute',
          bottom: 100,
          right: 10,
          padding: 20,
          backgroundColor: '#C19A6B',
          borderRadius: 50,
        }}
        asChild
      >
        <TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
