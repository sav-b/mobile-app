import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { generateUUID } from '../utils/uuid';
import { useApp } from '../context/AppContext';
import { Species } from '../types';

const speciesOptions: { value: Species; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { value: 'fish', label: 'Fish', emoji: '🐠' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'hamster', label: 'Hamster', emoji: '🐹' },
  { value: 'guinea_pig', label: 'Guinea Pig', emoji: '🐹' },
  { value: 'reptile', label: 'Reptile', emoji: '🦎' },
];

export default function AddPetScreen({ navigation }: any) {
  const { addPet } = useApp();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [notes, setNotes] = useState('');

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your pet');
      return;
    }
    if (!species) {
      Alert.alert('Error', 'Please select a species');
      return;
    }

    await addPet({
      id: generateUUID(),
      name: name.trim(),
      species,
      photo: photo || undefined,
      age: age ? parseInt(age, 10) : undefined,
      breed: breed.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter pet name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Species *</Text>
      <View style={styles.speciesGrid}>
        {speciesOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.speciesButton,
              species === option.value && styles.speciesButtonActive,
            ]}
            onPress={() => setSpecies(option.value)}
          >
            <Text style={styles.speciesEmoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.speciesLabel,
                species === option.value && styles.speciesLabelActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Age (years)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter age"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Breed</Text>
      <TextInput
        style={styles.input}
        value={breed}
        onChangeText={setBreed}
        placeholder="Enter breed (optional)"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Medical conditions, special needs, etc."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Add Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  photoButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90d9',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    color: '#4a90d9',
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  speciesButton: {
    width: '23%',
    margin: '1%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  speciesButtonActive: {
    backgroundColor: '#e8f4fd',
    borderWidth: 2,
    borderColor: '#4a90d9',
  },
  speciesEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  speciesLabel: {
    fontSize: 11,
    color: '#666',
  },
  speciesLabelActive: {
    color: '#4a90d9',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4a90d9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
