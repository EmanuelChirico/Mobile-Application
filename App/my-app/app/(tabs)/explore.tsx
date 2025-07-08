import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useColorScheme } from '../../hooks/useColorScheme';
export default function ExploreScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [showInput, setShowInput] = useState(false);
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      background: '#F8F4E1',
      card: '#E3D5B8',
      text: '#4C3D25',
      title: '#6B4F2C',
      border: '#D6C7A1',
      placeholder: '#9E8C6C',
      button: '#D6C7A1',
      buttonText: '#4C3D25',
      addButton: '#BFA77A',
      inputBg: '#FFF8E6',
      shadow: '#000',
      close: 'black',
    },
    dark: {
      background: '#181818',
      card: '#232323',
      text: '#FFD580',
      title: '#FFD580',
      border: '#444',
      placeholder: '#aaa',
      button: '#444',
      buttonText: '#FFD580',
      addButton: '#FFD580',
      inputBg: '#232323',
      shadow: '#000',
      close: '#FFD580',
    },
  };
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  const API_URL = 'http://192.168.1.138:3000/api/tipology';

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

  const deleteCategory = async (nameToDelete: string) => {
    try {
      await axios.delete(`${API_URL}/${encodeURIComponent(nameToDelete)}`);
      setCategories(prev => prev.filter(name => name !== nameToDelete));
    } catch (err) {
      console.error('Errore durante eliminazione:', err);
      alert('❌ Errore durante l\'eliminazione della categoria');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.addButton} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: theme.title, marginBottom: 20 }}>
        🧭 Explore Categories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: theme.card,
              paddingVertical: 20,
              borderRadius: 16,
              width: '48%',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              position: 'relative',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>{item}</Text>

            <TouchableOpacity
              onPress={() => deleteCategory(item)}
              style={{
                position: 'absolute',
                top: 6,
                right: 10,
                borderRadius: 12,
                padding: 4,
                width: 24,
                height:24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.close, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {showInput && (
        <View style={{ marginTop: 16 }}>
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Enter new category"
            placeholderTextColor={theme.placeholder}
            style={{
              backgroundColor: theme.inputBg,
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: theme.border,
              color: theme.text,
              fontSize: 16,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: theme.addButton,
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
          backgroundColor: theme.button,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
        onPress={() => setShowInput(!showInput)}
      >
        <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>
          ➕ {showInput ? 'Cancel' : 'Add new category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
