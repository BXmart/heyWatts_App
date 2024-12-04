import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import HeaderSection from '../components/welcome-questionnaire/HeaderSection';
import AddressSection from '../components/welcome-questionnaire/AddressSection';
import PhotoSection from '../components/welcome-questionnaire/PhotoSection';
import TechnologiesSection from '../components/welcome-questionnaire/TechnologiesSection';
import CollapsibleSection from '../components/welcome-questionnaire/CollapsibleSection';
import useAuthStore from '@/stores/useAuthStore';
import { postNewProperty } from '@/services/properties.service';
import { router } from 'expo-router';
import { URLS } from '@/utils/constants';
import { postSurveyFilled } from '@/services/survey.service';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

export enum UserTypes {
  USUARIO = 'OWNER',
  INSTALADOR = 'INSTALADOR',
}

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    _id: string;
    name: string;
    street: string;
    province: string;
    postalCode: string;
    additionalInfo: string;
    orientation: string;
    monthlyConsumption: string;
    surfaceArea: string;
    description: string;
    interestedDevices: string[];
    image: string | null;
    location: {};
    locationType: string;
    direction: string;
    consumption: string;
    roofArea: string;
  };
}

export const TECHNOLOGIES = [
  { id: '1', name: 'Fotovoltaica', icon: 'solar-power' },
  { id: '2', name: 'Batería', icon: 'battery-charging' },
  { id: '3', name: 'Cargador', icon: 'ev-station' },
  { id: '4', name: 'ACS', icon: 'water-boiler' },
  { id: '5', name: 'Aire acondicionado', icon: 'air-conditioner' },
  { id: '6', name: 'Electrodomésticos', icon: 'fridge' },
];

const initialLocation = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export interface Property {
  _id: string;
  additionalAddress: string;
  address: string;
  consumptionAvailableApi: number;
  contracts: [];
  createdAt: string;
  cups: string;
  dataRecovered: false;
  description: string;
  inclination: number;
  interestedDevices: string[];
  isDatadisOK: boolean;
  isTermAccepted: boolean;
  latitude: string;
  longitude: string;
  m2: number;
  monthAvg: number;
  municipality: string;
  name: string;
  orientation: number;
  pointType: number;
  postalCode: string;
  productionAvailableApi: number;
  province: string;
}

const initialData: Property = {
  _id: '',
  additionalAddress: '',
  address: '',
  consumptionAvailableApi: 0,
  contracts: [],
  createdAt: '2024-12-04 09:59:46',
  cups: '',
  dataRecovered: false,
  description: '',
  inclination: 0,
  interestedDevices: [],
  isDatadisOK: false,
  isTermAccepted: false,
  latitude: '',
  longitude: '',
  m2: 0,
  monthAvg: 0,
  municipality: '',
  name: 'Test',
  orientation: 0,
  pointType: 0,
  postalCode: '',
  productionAvailableApi: 0,
  province: '',
};

const MainFormContainer = () => {
  const mapRef = useRef<MapView>(null);
  const { user, setCurrentProperty, setUserFirstTime } = useAuthStore();
  const [formData, setFormData] = useState<Property>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [isPropertyCreated, setIsPropertyCreated] = useState(user?.user.propertyByDefault !== null);
  const takePhoto = async () => {
    if (!isPropertyCreated) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto. Por favor, intenta de nuevo.');
    }
  };

  const pickImage = async () => {
    if (!isPropertyCreated) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveProperty = async () => {
    try {
      if (!formData.name.trim()) {
        setErrorMessage('Por favor, introduce un nombre para la propiedad');
        return;
      }

      setIsSaving(true);
      setErrorMessage('');

      const userInfo = await SecureStore.getItemAsync('userInfo');
      if (!userInfo) {
        throw new Error('No se encontró información del usuario');
      }

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location' || key === 'interestedDevices') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'image' && value) {
          const filename = value.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          formDataToSend.append('image', {
            uri: value,
            name: filename,
            type,
          } as any);
        } else if (value !== null && key !== '_id') {
          formDataToSend.append(key, String(value));
        }
      });

      if (formData._id) {
        await axios.put(`/api/v1/web/property/${formData._id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('¡Éxito!', 'La propiedad se ha actualizado correctamente');
      } else {
        if (!user) return;
        const response = await postNewProperty({ ...formData, user: { _id: user?.user._id ?? '' } });
        if (response) {
          if (user.user.firstTime) {
            await postSurveyFilled(user.user._id);
          }
          if (user.user.propertyByDefault === null) {
            setCurrentProperty(response);
          }
          setUserFirstTime(user);
          router.navigate('/(home)');
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
      Alert.alert('Error', 'No se pudo guardar la propiedad. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setIsLoading(true);
      await handleSaveProperty();
    } catch (error) {
      console.error('Error finalizing property:', error);
      Alert.alert('Error', 'No se pudo finalizar la propiedad. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <HeaderSection errorMessage={errorMessage} />

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de la propiedad</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => {
                  setErrorMessage('');
                  setFormData((prev) => ({ ...prev, name: text }));
                }}
                placeholder="Mi hogar"
                placeholderTextColor="#6B7280"
              />
            </View>

            <CollapsibleSection title="Datos opcionales" isExpanded={isAddressExpanded} onToggle={() => setIsAddressExpanded(!isAddressExpanded)}>
              <AddressSection
                formData={formData}
                setFormData={setFormData}
                isAddressLoading={isAddressLoading}
                mapRef={mapRef}
                onInputChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
              />
            </CollapsibleSection>
            <TouchableOpacity style={[styles.submitButton, isLoading && styles.buttonDisabled]} onPress={handleFinalize} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#DBFFE8" /> : <Text style={styles.submitButtonText}>Crear propiedad</Text>}
            </TouchableOpacity>

            <PhotoSection
              isPropertyCreated={isPropertyCreated}
              image={formData.image}
              onTakePhoto={takePhoto}
              onPickImage={pickImage}
              onRemoveImage={() => setFormData((prev) => ({ ...prev, image: null }))}
            />

            <TechnologiesSection
              technologies={TECHNOLOGIES}
              selectedTechnologies={formData.interestedDevices}
              onToggleTechnology={(techId) => {
                const interestedDevice = TECHNOLOGIES.find((tech) => tech.id === techId);
                setFormData((prev) => ({ ...prev, interestedDevices: interestedDevice ? [...prev.interestedDevices, techId] : [...prev.interestedDevices.filter((id) => id !== techId)] }));
              }}
            />

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.submitButton, isLoading && styles.buttonDisabled]} onPress={handleFinalize} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#DBFFE8" /> : <Text style={styles.submitButtonText}>Guardar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F242A',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#DBFFE8',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 12,
    color: '#DBFFE8',
    fontSize: 16,
  },
  bottomPadding: {
    height: 80,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F242A',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#083344',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#035170',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  draftButtonText: {
    color: '#DBFFE8',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#DBFFE8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainFormContainer;
