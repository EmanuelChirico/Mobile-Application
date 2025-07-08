import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExploreScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [showInput, setShowInput] = useState(false);

  const API_URL = 'http://172.19.241.82:3000/api/tipology';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      const names = response.data.map((item: { nome: string }) => item.nome);
      setCategories(names);
    } catch (error) {
      console.error('Errore nel recupero delle tipologie:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        nome: newCategory.trim(),
      });

      setCategories(prev => [...prev, res.data.nome]);
      setNewCategory('');
      setShowInput(false);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert('⚠️ Categoria già esistente');
      } else {
        console.error('Errore durante aggiunta:', err.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E1' }}>
        <ActivityIndicator size="large" color="#BFA77A" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F8F4E1' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#6B4F2C', marginBottom: 20 }}>
        🧭 Explore Categories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#E3D5B8',
              paddingVertical: 20,
              borderRadius: 16,
              width: '48%',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#4C3D25' }}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {showInput && (
        <View style={{ marginTop: 16 }}>
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Enter new category"
            placeholderTextColor="#9E8C6C"
            style={{
              backgroundColor: '#FFF8E6',
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#D6C7A1',
              color: '#4C3D25',
              fontSize: 16,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#BFA77A',
              padding: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={addCategory}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>✅ Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={{
          marginTop: 24,
          marginBottom: 90,
          backgroundColor: '#D6C7A1',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
        onPress={() => setShowInput(!showInput)}
      >
        <Text style={{ color: '#4C3D25', fontSize: 16, fontWeight: 'bold' }}>
          ➕ {showInput ? 'Cancel' : 'Add new category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
