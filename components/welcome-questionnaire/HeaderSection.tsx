import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderSectionProps {
  errorMessage?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ errorMessage }) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>¡Bienvenido al Cuestionario</Text>
        <Text style={styles.subtitle}>de Cliente de heyWatts!</Text>
        <Text style={styles.description}>Para poder aportarte una experiencia acorde a sus necesidades, rellene el siguiente cuestionario</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DBFFE8',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#DBFFE8',
    marginTop: 8,
  },
  description: {
    color: '#DBFFE8',
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});

export default HeaderSection;
