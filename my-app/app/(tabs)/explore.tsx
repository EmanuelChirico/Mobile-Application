import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const categories: string[] = ['Culture 📖', 'Natura 🪴', 'Relax 🧖🏼‍♂️', 'Adventure 🧗🏽‍♂️'];

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#EDE8D0' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Travels categories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#FFDE00',
              padding: 20,
              borderRadius: 10,
              width: '48%',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '500' }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={{
          marginTop: 20,
          marginBottom: 90,
          backgroundColor: '#FFAB00',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => {
          // TODO: inserisci qui la logica per aggiungere categoria
          console.log('Aggiungi nuova categoria');
        }}
      >
        <Text style={{ color: '#00000', fontSize: 16, fontWeight: 'bold' }}> ➕ Add new category</Text>
      </TouchableOpacity>
    </View>
  );
}
