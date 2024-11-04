import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

interface TechnologyOption {
  id: string;
  name: string;
  icon: string;
}

const TECHNOLOGIES: TechnologyOption[] = [
  { id: '1', name: 'Fotovoltaica', icon: 'solar-power' },
  { id: '2', name: 'Batería', icon: 'battery-charging' },
  { id: '3', name: 'Cargador', icon: 'ev-station' },
];

const initialData = {
  name: 'Mi hogar',
  description: '',
  interestedDevices: [],
  image: null,
};

export default function WelcomeQuestionnaire() {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la cámara');
      return false;
    }
    return true;
  };

  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const userInfo = await SecureStore.getItemAsync('userInfo');
      const { token } = JSON.parse(userInfo || '{}');

      // Create form data for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('interestedDevices', JSON.stringify(formData.interestedDevices));

      if (formData.image) {
        const filename = formData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image';

        formDataToSend.append('image', {
          uri: formData.image,
          name: filename,
          type,
        } as any);
      }

      await axios.post('/api/v1/web/property', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to next screen
      // navigation.navigate('NextScreen');
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTechnology = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      interestedDevices: prev.interestedDevices.includes(techId) ? prev.interestedDevices.filter((id) => id !== techId) : [...prev.interestedDevices, techId],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>¡Bienvenido al Cuestionario</Text>
            <Text style={styles.subtitle}>de Cliente de heyWatts!</Text>
            <Text style={styles.description}>Para poder aportarte una experiencia acorde a sus necesidades, rellene el siguiente cuestionario</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>¿Cómo se llama tu propiedad?</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))} placeholder="Mi hogar" placeholderTextColor="#6B7280" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Haz una breve descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
              placeholder="Ej: Nuestra casa de dos plantas con piscina..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.label}>Añade una foto de tu propiedad</Text>
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <MaterialCommunityIcons name="camera" size={24} color="#DBFFE8" />
                <Text style={styles.photoButtonText}>Tomar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <MaterialCommunityIcons name="image" size={24} color="#DBFFE8" />
                <Text style={styles.photoButtonText}>Galería</Text>
              </TouchableOpacity>
            </View>
            {formData.image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setFormData((prev) => ({ ...prev, image: null }))}>
                  <MaterialCommunityIcons name="close-circle" size={24} color="#DBFFE8" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.technologiesSection}>
            <Text style={styles.label}>¿Qué tecnologías usas?</Text>
            <View style={styles.technologiesGrid}>
              {TECHNOLOGIES.map((tech) => (
                <TouchableOpacity key={tech.id} style={[styles.technologyCard, formData.interestedDevices.includes(tech.id) && styles.selectedCard]} onPress={() => toggleTechnology(tech.id)}>
                  <MaterialCommunityIcons name={tech.icon} size={32} color={formData.interestedDevices.includes(tech.id) ? '#DBFFE8' : '#035170'} />
                  <Text style={[styles.technologyText, formData.interestedDevices.includes(tech.id) && styles.selectedText]}>{tech.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#DBFFE8" /> : <Text style={styles.submitButtonText}>Guardar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#0F242A',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DBFFE8',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#DBFFE8',
    marginTop: 8,
  },
  description: {
    color: '#DBFFE8',
    textAlign: 'center',
    marginTop: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#DBFFE8',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 12,
    color: '#DBFFE8',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoSection: {
    marginBottom: 24,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#035170',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: '#DBFFE8',
    fontSize: 14,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginTop: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#083344',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 36, 42, 0.8)',
    borderRadius: 12,
  },
  technologiesSection: {
    marginBottom: 24,
  },
  technologiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  technologyCard: {
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    aspectRatio: 1,
  },
  selectedCard: {
    backgroundColor: '#035170',
  },
  technologyText: {
    color: '#DBFFE8',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#035170',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#DBFFE8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
