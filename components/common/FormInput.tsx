import { THEME } from '@/utils/Colors';
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const FormInput = ({ label, error, style, ...props }: FormInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, error && styles.inputError, style]} placeholderTextColor={THEME.text.secondary} {...props} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: THEME.text.primary,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: THEME.lightBlue,
    color: THEME.text.primary,
  },
  inputError: {
    borderColor: THEME.error,
  },
  errorText: {
    color: THEME.text.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;
