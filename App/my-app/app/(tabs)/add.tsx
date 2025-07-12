import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '@/constants/constants';
import DateTimePicker from '@react-native-community/datetimepicker';

import LabeledInput from '@/components/LabeledInput';
import CategorySelector from '@/components/CategorySelector';

export default function AddScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [title, setTitle] = useState('');
  const [zone, setZone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [focused, setFocused] = useState({
    title: false,
    zone: false,
    notes: false,
  });

  const themeColors = {
    light: {
      background: '#FAF7ED',
      card: '#fff',
      text: '#2C2C2C',
      label: '#444',
      border: '#ccc',
      borderActive: '#FFD600',
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
      borderActive: '#FFD600',
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
  const theme = colorScheme === 'dark' ? themeColors.dark : themeColors.light;

  useFocusEffect(
      useCallback(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/tipology`);
            const names = response.data.map((item: { nome: string }) => item.nome);
            setCategories(names);
          } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
          }
        };
        fetchCategories();
      }, [])
  );

  const fetchLocationSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'User-Agent': 'MobileApp/1.0 (email@email.com)',
          'Accept-Language': 'it',
        },
      });
      const suggestions = response.data.map((item: any) => item.display_name);
      setLocationSuggestions(suggestions);
    } catch (err) {
      console.error('Errore durante il suggerimento località:', err);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setImages(result.assets.map(asset => asset.base64).filter((b): b is string => !!b));    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Errore', 'Il titolo è obbligatorio');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Errore', 'Devi selezionare sia la data di inizio che quella di fine');
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      Alert.alert('Errore', 'La data di fine non può essere precedente a quella di inizio');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/trips`, {
        title,
        description: notes,
        images,
        category: selectedCategory,
        location: zone,
        start_date: startDate ? startDate.toISOString().slice(0, 10) : null,
        end_date: endDate ? endDate.toISOString().slice(0, 10) : null,
      });

      Alert.alert('Successo', 'Viaggio salvato correttamente!');
      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Errore', 'Impossibile salvare il viaggio.');
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={80}
      >
        <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              backgroundColor: theme.background,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 24,
            color: theme.text,
          }}>
            Tell me more!
          </Text>

          <LabeledInput
              label="Trip Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Weekend in Rome"
              theme={theme}
              focused={focused.title}
              onFocus={() => setFocused(prev => ({ ...prev, title: true }))}
              onBlur={() => setFocused(prev => ({ ...prev, title: false }))}
          />

          <LabeledInput
              label="Location"
              value={zone}
              onChangeText={(text) => {
                setZone(text);
                fetchLocationSuggestions(text);
              }}
              placeholder="e.g. Rome, Italy"
              theme={theme}
              focused={focused.zone}
              onFocus={() => setFocused(prev => ({ ...prev, zone: true }))}
              onBlur={() => setFocused(prev => ({ ...prev, zone: false }))}
          />

          {locationSuggestions.length > 0 && (
              <View style={{ marginTop: 8, backgroundColor: theme.card, borderRadius: 8 }}>
                {locationSuggestions.map((suggestion, index) => (
                    <Pressable
                        key={`${suggestion}-${index}`}
                        onPress={() => {
                          setZone(suggestion);
                          setLocationSuggestions([]);
                        }}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: theme.border,
                        }}
                    >
                      <Text style={{ color: theme.text }}>{suggestion}</Text>
                    </Pressable>
                ))}
              </View>
          )}

          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Category</Text>

          <CategorySelector
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              theme={theme}
          />

          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Photos</Text>
          {images.length > 0 ? (
              <ScrollView horizontal style={{ marginBottom: 12 }}>
                {images.map((img, idx) => (
                    <View key={idx} style={{ position: 'relative', marginRight: 8 }}>
                      <Image
                          source={{ uri: `data:image/jpeg;base64,${img}` }}
                          style={{ width: 100, height: 100, borderRadius: 8 }}
                      />
                      <TouchableOpacity
                          onPress={() => handleRemoveImage(idx)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            borderRadius: 12,
                            width: 24,
                            height: 24,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                      >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>×</Text>
                      </TouchableOpacity>
                    </View>
                ))}
              </ScrollView>
          ) : (
              <Text style={{ color: theme.noImage, marginBottom: 12 }}>No image selected</Text>
          )}

          <Pressable
              style={{
                backgroundColor: theme.imageButton,
                padding: 12,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={pickImages}
          >
            <Text style={{ color: theme.imageButtonText, fontWeight: '600', fontSize: 16 }}>Choose from Gallery</Text>
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>Start Date</Text>
          <TouchableOpacity
              style={{
                backgroundColor: theme.card,
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              onPress={() => setShowStartPicker(true)}
          >
            <Text style={{ color: theme.text }}>
              {startDate ? startDate.toLocaleDateString() : 'Select start date'}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
              <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
              />
          )}

          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6, marginTop: 16, color: theme.label }}>End Date</Text>
          <TouchableOpacity
              style={{
                backgroundColor: theme.card,
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              onPress={() => setShowEndPicker(true)}
          >
            <Text style={{ color: theme.text }}>
              {endDate ? endDate.toLocaleDateString() : 'Select end date'}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
              <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  minimumDate={startDate || undefined}
                  onChange={(_, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
              />
          )}

          <LabeledInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add additional info about this trip..."
              multiline
              theme={theme}
              focused={focused.notes}
              onFocus={() => setFocused(prev => ({ ...prev, notes: true }))}
              onBlur={() => setFocused(prev => ({ ...prev, notes: false }))}
              style={{ minHeight: 100 }}
          />

          <Pressable
              style={{
                backgroundColor: theme.button,
                paddingVertical: 16,
                borderRadius: 30,
                marginTop: 30,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 4,
              }}
              onPress={handleSave}
          >
            <Text style={{ color: theme.buttonText, fontWeight: 'bold', fontSize: 18 }}>Save</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}