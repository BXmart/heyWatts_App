import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TechnologyOption {
  id: string;
  name: string;
  icon: string;
}

interface TechnologiesSectionProps {
  technologies: TechnologyOption[];
  selectedTechnologies: string[];
  onToggleTechnology: (techId: string) => void;
}

const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ technologies, selectedTechnologies, onToggleTechnology }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tecnologías de Interés</Text>
      <View style={styles.technologiesGrid}>
        {technologies.map((tech) => (
          <TouchableOpacity key={tech.id} style={[styles.technologyCard, selectedTechnologies.includes(tech.id) && styles.selectedCard]} onPress={() => onToggleTechnology(tech.id)}>
            <MaterialCommunityIcons name={tech.icon as any} size={32} color={selectedTechnologies.includes(tech.id) ? '#DBFFE8' : '#035170'} />
            <Text style={styles.technologyText}>{tech.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DBFFE8',
    marginBottom: 16,
  },
  technologiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  technologyCard: {
    backgroundColor: '#083344',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
});

export default TechnologiesSection;
