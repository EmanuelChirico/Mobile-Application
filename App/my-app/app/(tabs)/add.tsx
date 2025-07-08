import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';

const AddScreen = () => {
  const [title, setTitle] = useState('');
  const [zone, setZone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      background: '#FAF7ED',
      card: '#fff',
      text: '#2C2C2C',
      label: '#444',
      border: '#ccc',
      placeholder: '#999',
      button: '#6C4F3D',
      buttonText: '#fff',
      categoryBg: '#eee',
      categorySelected: '#C19A6B',
      categoryText: '#555',
      categoryTextSelected: '#fff',
      imageButton: '#C19A6B',
      imageButtonText: '#fff',
      noImage: '#777',
    },
    dark: {
      background: '#181818',
      card: '#232323',
      text: '#FFD580',
      label: '#FFD580',
      border: '#444',
      placeholder: '#aaa',
      button: '#FFD580',
      buttonText: '#232323',
      categoryBg: '#232323',
      categorySelected: '#FFD580',
      categoryText: '#FFD580',
      categoryTextSelected: '#232323',
      imageButton: '#FFD580',
      imageButtonText: '#232323',
      noImage: '#aaa',
    },
  };
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://192.168.1.138:3000/api/tipology');
          const names = response.data.map((item: { nome: string }) => item.nome);
          setCategories(names);
        } catch (error) {
          console.error('Errore nel recupero delle categorie:', error);
        }
      };
      fetchCategories();
    }, [])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Errore', 'Il titolo è obbligatorio');
      return;
    }

    try {
      const description = `Zona: ${zone}\nCategoria: ${selectedCategory}\n\n${notes}`;

      await axios.post('http://192.168.1.138:3000/api/trips', {
        title,
        description,
        image_base64: imageBase64 || null,
        category: selectedCategory,
      });

      Alert.alert('Successo', 'Viaggio salvato correttamente!');

      setTitle('');
      setZone('');
      setNotes('');
      setSelectedCategory('');
      setImageBase64(null);

      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Errore', 'Impossibile salvare il viaggio.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, backgroundColor: theme.background, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: theme.text }}>
          Add your new travel!
        </Text>

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Travel Name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Weekend in Rome"
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 14,
            fontSize: 16,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
          }}
          placeholderTextColor={theme.placeholder}
        />

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Location</Text>
        <TextInput
          value={zone}
          onChangeText={setZone}
          placeholder="e.g. Rome, Italy"
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 14,
            fontSize: 16,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
          }}
          placeholderTextColor={theme.placeholder}
        />

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? theme.categorySelected : theme.categoryBg,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: selectedCategory === cat ? theme.categoryTextSelected : theme.categoryText,
                  fontWeight: selectedCategory === cat ? '600' : 'normal',
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Photo</Text>
        {imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }}
          />
        ) : (
          <Text style={{ color: theme.noImage, marginBottom: 12 }}>No image selected</Text>
        )}
        <Pressable style={{ backgroundColor: theme.imageButton, padding: 12, borderRadius: 20, alignItems: 'center' }} onPress={pickImage}>
          <Text style={{ color: theme.imageButtonText, fontWeight: '600', fontSize: 16 }}>Choose from Gallery</Text>
        </Pressable>

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add additional info about this trip..."
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 14,
            fontSize: 16,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            minHeight: 100,
            textAlignVertical: 'top',
          }}
          placeholderTextColor={theme.placeholder}
        />

        <Pressable style={{ backgroundColor: theme.button, paddingVertical: 16, borderRadius: 30, marginTop: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 4 }} onPress={handleSave}>
          <Text style={{ color: theme.buttonText, fontWeight: 'bold', fontSize: 18 }}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddScreen;
