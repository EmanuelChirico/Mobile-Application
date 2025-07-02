import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useState } from 'react';

export default function AddEditScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold',marginTop:20,textAlign : 'center' }}>Add your new travel!</Text>
      <Text style={{marginTop:10, fontSize:18, fontWeight: 'bold'}}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12, borderRadius:20, marginTop:10 }}
      />
      <Text style={{marginTop:10, fontSize:18, fontWeight: 'bold'}}>Zone</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12, borderRadius:20, marginTop:10 }}
      />
      <Text style={{marginTop:10, fontSize:18, fontWeight: 'bold'}}>Notes</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 50, marginBottom: 12, borderRadius:20, marginTop:10 }}
      />
      <Button title="Salva" onPress={() => { /* TODO: salva i dati */ }} />
    </ScrollView>
  );
}
