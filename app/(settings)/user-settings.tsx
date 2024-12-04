import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useAuthStore from '@/stores/useAuthStore';
import { Card } from 'react-native-paper';
import FormInput from '@/components/common/FormInput';
import { ROLES, URLS } from '@/utils/constants';
import { PropertyI } from '@/types/Property';
import { Image } from 'expo-image';
import { THEME } from '@/utils/Colors';
import { useForm, Controller } from 'react-hook-form';
import { Text } from 'react-native';
import { EditUserRequestI } from '@/types/EditUserRequest';

const Select = ({ label, options, control, name }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Picker
          style={styles.picker}
          selectedValue={value?._id}
          onValueChange={(itemValue) => onChange({ _id: itemValue })}
          dropdownIconColor={THEME.text.primary}
          itemStyle={{ color: THEME.text.primary }}
        >
          {options.map((option) => (
            <Picker.Item key={option._id} label={option.name} value={option._id} color={THEME.text.primary} />
          ))}
        </Picker>
      )}
    />
  </View>
);

const UploadAvatarImg = ({ currentImg, onChange }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
      {currentImg ? (
        <Image source={{ uri: currentImg }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.placeholderText}>Select Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const UserSettings = () => {
  const navigation = useNavigation();
  const { user, updateUserInfo, properties } = useAuthStore();

  const { control, handleSubmit, setValue } = useForm<EditUserRequestI>({
    defaultValues: {
      _id: user?.user._id || '',
      name: user?.user.name || '',
      surname: user?.user.surname || '',
      email: user?.user.email || '',
      img: user?.user.img || '',
      organizationId: user?.user.organization?._id,
      organizationName: user?.user.organization?.name,
      propertyByDefault: {
        _id: user?.user.propertyByDefault?._id,
      },
    },
  });

  const onSubmit = async (data: EditUserRequestI) => {
    try {
      await updateUserInfo(user?.user?._id ?? '', data);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.avatarSection}>
            <Controller control={control} name="img" render={({ field: { onChange, value } }) => <UploadAvatarImg currentImg={value} onChange={onChange} />} />
          </View>

          <View style={styles.formSection}>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => <FormInput label="Nombre" value={value} onChangeText={onChange} error={error?.message} />}
            />

            <Controller
              control={control}
              name="surname"
              rules={{ required: 'Surname is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => <FormInput label="Apellidos" value={value} onChangeText={onChange} error={error?.message} />}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormInput label="Correo electrónico" value={value} onChangeText={onChange} keyboardType="email-address" error={error?.message} />
              )}
            />

            {user?.user.type === ROLES.OWNER && (
              <Select
                label="Propiedad por defecto"
                name="propertyByDefault"
                control={control}
                options={
                  properties ??
                  [].map((property: PropertyI) => ({
                    id: property._id,
                    value: property._id,
                    name: property.name,
                  })) ??
                  []
                }
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(URLS.PASSWORD_CHANGE_PASSWORD)}>
              <Text style={styles.buttonText}>Cambiar contraseña</Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: THEME.backgroundDefault,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: THEME.lightBlue,
    borderColor: THEME.border,
    borderWidth: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: THEME.text.primary,
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: THEME.text.primary,
  },
  picker: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 4,
    color: THEME.text.primary,
    backgroundColor: THEME.lightBlue,
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

export default UserSettings;
