import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, PanResponder, GestureResponderEvent, Dimensions } from 'react-native';
import { Searchbar } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CompassDirection } from './CompassInput';
import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

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
}

interface AddressSectionProps {
  formData: {
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
  };
  isAddressLoading: boolean;
  mapRef: React.RefObject<MapView>;
  setFormData: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  onInputChange: (key: string, value: string) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ formData, mapRef, setFormData, onInputChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&countrycodes=es`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const updateAddressFromLocation = async (latitude: number, longitude: number) => {
    setIsAddressLoading(true);
    try {
      const response = await axios.get(REVERSE_GEOCODE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
          zoom: 18,
        },
        headers: {
          'User-Agent': 'YourApp/1.0',
        },
      });

      const address = response.data.address;
      let streetComponents = [];
      if (address.road) streetComponents.push(address.road);
      if (address.house_number) streetComponents.push(address.house_number);

      const streetAddress = streetComponents.join(' ');
      const province = address.province || address.state || address.region || '';
      const postalCode = address.postcode || '';
      const additionalInfo = [address.suburb, address.neighbourhood, address.district].filter(Boolean).join(', ');

      setFormData((prev) => ({
        ...prev,
        street: streetAddress,
        province: province,
        postalCode: postalCode,
        additionalInfo: additionalInfo,
      }));
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setIsAddressLoading(false);
    }
  };
  const handleLocationSelect = async (result: SearchResult) => {
    const newLocation = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121,
    };

    setFormData((prev) => ({
      ...prev,
      location: newLocation,
    }));

    mapRef.current?.animateToRegion(newLocation, 1000);
    await updateAddressFromLocation(newLocation.latitude, newLocation.longitude);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...coordinate,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      },
    }));
    await updateAddressFromLocation(coordinate.latitude, coordinate.longitude);
  };

  const handleMarkerDrag = async (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...coordinate,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      },
    }));
    await updateAddressFromLocation(coordinate.latitude, coordinate.longitude);
  };

  const renderSearchResults = () => {
    if (!searchResults.length || !searchQuery) return null;

    return (
      <View style={styles.searchResultsContainer}>
        {searchResults.map((result, index) => (
          <TouchableOpacity key={index} style={styles.searchResultItem} onPress={() => handleLocationSelect(result)}>
            <Text style={styles.searchResultText}>{result.display_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ubicación</Text>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar dirección"
          onChangeText={(text) => {
            setSearchQuery(text);
            searchPlaces(text);
          }}
          value={searchQuery}
          loading={isSearching}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor="#DBFFE8"
          placeholderTextColor="#6B7280"
        />
        {renderSearchResults()}
      </View>
      <MapView ref={mapRef} style={styles.map} initialRegion={formData.location} onPress={handleMapPress}>
        <Marker coordinate={formData.location} draggable onDragEnd={handleMarkerDrag} />
      </MapView>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isAddressLoading && styles.inputLoading]}
            value={formData.street}
            onChangeText={(text) => onInputChange('street', text)}
            placeholder="Calle y número"
            placeholderTextColor="#6B7280"
            editable={!isAddressLoading}
          />
          {isAddressLoading && <ActivityIndicator size="small" color="#DBFFE8" style={styles.inputLoader} />}
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Provincia</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, isAddressLoading && styles.inputLoading]}
              value={formData.province}
              onChangeText={(text) => onInputChange('province', text)}
              placeholder="Provincia"
              placeholderTextColor="#6B7280"
              editable={!isAddressLoading}
            />
            {isAddressLoading && <ActivityIndicator size="small" color="#DBFFE8" style={styles.inputLoader} />}
          </View>
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Código Postal</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, isAddressLoading && styles.inputLoading]}
              value={formData.postalCode}
              onChangeText={(text) => onInputChange('postalCode', text)}
              placeholder="CP"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              editable={!isAddressLoading}
            />
            {isAddressLoading && <ActivityIndicator size="small" color="#DBFFE8" style={styles.inputLoader} />}
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Orientación del Tejado</Text>
        <CompassDirection value={formData.direction} onChange={(value) => onInputChange('direction', value)} />
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Consumo Mensual</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={formData.consumption}
              onChangeText={(text) => onInputChange('consumption', text)}
              placeholder="kWh/mes"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Área del Tejado</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} value={formData.roofArea} onChangeText={(text) => onInputChange('roofArea', text)} placeholder="m²" placeholderTextColor="#6B7280" keyboardType="numeric" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    color: '#DBFFE8',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  searchContainer: {
    zIndex: 1,
    position: 'relative',
  },
  searchbar: {
    backgroundColor: '#0F242A',
    elevation: 0,
    borderRadius: 8,
  },
  searchInput: {
    color: '#DBFFE8',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#083344',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 2,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0F242A',
  },
  searchResultText: {
    color: '#DBFFE8',
    fontSize: 14,
  },
  map: {
    height: 300,
    marginTop: 8,
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#0F242A',
    borderRadius: 8,
    padding: 12,
    color: '#DBFFE8',
    fontSize: 16,
  },
  inputLoading: {
    opacity: 0.7,
  },
  inputLoader: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddressSection;
