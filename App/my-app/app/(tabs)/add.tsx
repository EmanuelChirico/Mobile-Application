import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddEditScreen() {
  const [title, setTitle] = useState('');
  const [zone, setZone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();


  useFocusEffect(
    useCallback(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://10.56.186.198:3000/api/tipology');
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

    await axios.post('http://10.56.186.198:3000/api/trips', {
      title,
      description,
      image_base64: imageBase64 || null,
      category: selectedCategory,
    });

    Alert.alert('Successo', 'Viaggio salvato correttamente!');

    // ✅ Svuota tutti i campi
    setTitle('');
    setZone('');
    setNotes('');
    setSelectedCategory('');
    setImageBase64(null);

    // ✅ Opzionale: torna alla schermata iniziale
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
        contentContainerStyle={{ padding: 20, backgroundColor: '#FAF7ED', paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add your new travel!</Text>

        <Text style={styles.label}>Travel Name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Weekend in Rome"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          value={zone}
          onChangeText={setZone}
          placeholder="e.g. Rome, Italy"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categorySelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Photo</Text>
        {imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }}
          />
        ) : (
          <Text style={{ color: '#777', marginBottom: 12 }}>No image selected</Text>
        )}
        <Pressable style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Choose from Gallery</Text>
        </Pressable>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add additional info about this trip..."
          multiline
          numberOfLines={4}
          style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
          placeholderTextColor="#999"
        />

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2C2C2C',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#6C4F3D',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: '#C19A6B',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#C19A6B',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
