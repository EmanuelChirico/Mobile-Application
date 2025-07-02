import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const results: { id: string; title: string; location: string }[] = [];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Cerca per titolo o località"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>
              {item.title} - {item.location}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nessun risultato</Text>}
      />
    </View>
  );
}