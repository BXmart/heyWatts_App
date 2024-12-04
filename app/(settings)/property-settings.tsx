import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TechnologiesSection from '@/components/welcome-questionnaire/TechnologiesSection';
import FormInput from '@/components/common/FormInput';
import useAuthStore from '@/stores/useAuthStore';
import { TECHNOLOGIES } from '../owner-survey';
import { THEME } from '@/utils/Colors';

const propertySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  address: z.string().min(1, 'La dirección es requerida'),
  additionalAddress: z.string().optional(),
  municipality: z.string().min(1, 'La ciudad es requerida'),
  province: z.string().min(1, 'La provincia es requerida'),
  postalCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  latitude: z.string(),
  longitude: z.string(),
  m2: z.number().optional(),
  monthAvg: z.number().optional(),
  inclination: z.number().optional(),
  orientation: z.number().optional(),
  interestedDevices: z.array(z.number()),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyEditScreen = () => {
  const navigation = useNavigation();
  const { currentPropertyObject, updateProperty } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: currentPropertyObject?.name || '',
      description: currentPropertyObject?.description || '',
      address: currentPropertyObject?.address || '',
      additionalAddress: currentPropertyObject?.additionalAddress || '',
      municipality: currentPropertyObject?.municipality || '',
      province: currentPropertyObject?.province || '',
      postalCode: currentPropertyObject?.postalCode || '',
      latitude: currentPropertyObject?.latitude || '39.47649',
      longitude: currentPropertyObject?.longitude || '-6.37224',
      m2: currentPropertyObject?.m2 || 0,
      monthAvg: currentPropertyObject?.monthAvg || 0,
      inclination: currentPropertyObject?.inclination || 0,
      orientation: currentPropertyObject?.orientation || 0,
      interestedDevices: currentPropertyObject?.interestedDevices || [],
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      console.log('here');
      await updateProperty(currentPropertyObject?._id, data);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Datos generales</Text>
            {Object.keys(errors).length > 0 && <Text style={styles.errorSummary}>Por favor, corrija los errores marcados en rojo</Text>}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => <FormInput label="Nombre de la propiedad" value={value} onChangeText={onChange} error={errors.name?.message} />}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => <FormInput label="Descripción" value={value} onChangeText={onChange} multiline numberOfLines={3} error={errors.description?.message} />}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Localización</Text>
            <View style={styles.inputGroup}>
              {['address', 'additionalAddress', 'municipality', 'province', 'postalCode'].map((field) => (
                <Controller
                  key={field}
                  control={control}
                  name={field}
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={value}
                      onChangeText={onChange}
                      error={errors[field]?.message}
                      keyboardType={field === 'postalCode' ? 'numeric' : 'default'}
                      maxLength={field === 'postalCode' ? 5 : undefined}
                    />
                  )}
                />
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <TechnologiesSection
              technologies={TECHNOLOGIES}
              selectedTechnologies={watch('interestedDevices')}
              onToggleTechnology={(techId: string) => {
                const numericTechId = Number(techId);
                setValue('interestedDevices', [...(watch('interestedDevices') || []), numericTechId]);
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSubmit(onSubmit)}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: THEME.deepBlue,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderColor: THEME.border,
    borderWidth: 1,
  },
  content: {
    width: '100%',
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: THEME.text.primary,
  },
  errorSummary: {
    color: THEME.error,
    marginBottom: 16,
    fontSize: 14,
  },
  inputGroup: {
    gap: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.lightBlue,
  },
  primaryButton: {
    backgroundColor: THEME.lightBlue,
  },
  buttonText: {
    color: THEME.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: THEME.text.primary,
  },
});

export default PropertyEditScreen;
