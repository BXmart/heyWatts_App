import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PhotoSectionProps {
  isPropertyCreated: boolean;
  image: string | null;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
}

const PhotoPlaceholder = () => (
  <View style={styles.photoPlaceholder}>
    <MaterialCommunityIcons name="image-off" size={48} color="#6B7280" />
    <Text style={styles.photoPlaceholderText}>Primero debes crear una propiedad para poder añadir una foto del DNI</Text>
  </View>
);

const PhotoSection: React.FC<PhotoSectionProps> = ({ isPropertyCreated, image, onTakePhoto, onPickImage, onRemoveImage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Añade una foto de su DNI</Text>
      {!isPropertyCreated ? (
        <PhotoPlaceholder />
      ) : (
        <>
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={onTakePhoto}>
              <MaterialCommunityIcons name="camera" size={24} color="#DBFFE8" />
              <Text style={styles.photoButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={onPickImage}>
              <MaterialCommunityIcons name="image" size={24} color="#DBFFE8" />
              <Text style={styles.photoButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={onRemoveImage}>
                <MaterialCommunityIcons name="close-circle" size={24} color="#DBFFE8" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    color: '#DBFFE8',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
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
  photoPlaceholder: {
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  photoPlaceholderText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
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
    padding: 4,
  },
});

export default PhotoSection;
