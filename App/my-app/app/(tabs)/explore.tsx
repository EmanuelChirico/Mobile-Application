import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ExploreColors } from '../../constants/Colors';
import { fetchCategories, addCategory, deleteCategory } from '../../services/categories';
import CategoryCard from '../../components/CategoryCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [showInput, setShowInput] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? ExploreColors.dark : ExploreColors.light;

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const created = await addCategory(newCategory.trim());
      setCategories(prev => [...prev, created]);
      setNewCategory('');
      setShowInput(false);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert('⚠️ Categoria già esistente');
      } else {
        Alert.alert('Errore', 'Impossibile creare la categoria.');
      }
    }
  };

  const handleDeleteCategory = async (name: string) => {
    try {
      await deleteCategory(name);
      setCategories(prev => prev.filter(cat => cat !== name));
    } catch (err) {
      Alert.alert("Errore", "Non puoi eliminare una categoria associata a un viaggio.");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: theme.title, marginBottom: 20 }}>
          Explore Categories
        </Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item }) => (
            <CategoryCard name={item} onDelete={() => handleDeleteCategory(item)} theme={theme} />
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
              onPress={handleAddCategory}
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
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={() => setShowInput(!showInput)}
        >
          {showInput ? (
            <>
              <MaterialCommunityIcons name="close-circle-outline" size={22} color={theme.buttonText} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="plus-circle-outline" size={22} color={theme.buttonText} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>Add new category</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
