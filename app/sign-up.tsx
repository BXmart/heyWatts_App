import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { URLS } from '@/utils/constants';
import useAuthStore, { RegisterData } from '@/stores/useAuthStore';
import { z } from 'zod';

export enum UserTypes {
  USUARIO = 'OWNER',
  INSTALADOR = 'INSTALLER',
}

// Define the validation schema with Zod
const registerSchema = z
  .object({
    type: z.enum([UserTypes.USUARIO, UserTypes.INSTALADOR]),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder 50 caracteres'),
    surname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres').max(50, 'Los apellidos no pueden exceder 50 caracteres'),
    email: z.string().email('Ingrese un correo electrónico válido').min(1, 'El correo electrónico es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string(),
    organizacionName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

// Interface for form errors
interface FormErrors {
  [key: string]: string | undefined;
}

export default function RegisterPage() {
  const { register } = useAuthStore();
  const [userType, setUserType] = useState(UserTypes.USUARIO);
  const [formData, setFormData] = useState<Partial<RegisterSchema>>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizacionName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    try {
      registerSchema.parse({
        ...formData,
        type: userType,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const formDataToSubmit: RegisterData = {
          type: userType,
          name: formData.name!,
          surname: formData.surname!,
          email: formData.email!,
          password: formData.password!,
          ...(userType === UserTypes.USUARIO && { organizacionName: formData.organizacionName }),
        };
        console.log({ formDataToSubmit });
        const result = await register(formDataToSubmit);
      } catch (error) {
        Alert.alert('Error', 'Error en el registro. Por favor, intente nuevamente.');
        console.error('Registration failed', error);
      }
    }
  };

  const handleChange = (field: keyof RegisterSchema, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.leftPanel}>
          <LinearGradient colors={['#4ade80', '#22c55e']} style={styles.gradient}>
            <Image width={100} source={require('@/assets/branding/hw-logo-hor-dark-01.png')} style={styles.logo} />
            <Text style={styles.welcomeText}>¡Regístrate!</Text>
            <Text style={styles.welcomeSubtext}>Únete a nosotros para gestionar tu energía de manera inteligente y eficiente.</Text>
          </LinearGradient>
        </View>
        <View style={styles.rightPanel}>
          <View style={styles.tabSelector}>
            <TouchableOpacity style={[styles.tab, userType === UserTypes.USUARIO && styles.activeTab]} onPress={() => setUserType(UserTypes.USUARIO)}>
              <Text style={[styles.tabText, userType === UserTypes.USUARIO && styles.activeTabText]}>Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, userType === UserTypes.INSTALADOR && styles.activeTab]} onPress={() => setUserType(UserTypes.INSTALADOR)}>
              <Text style={[styles.tabText, userType === UserTypes.INSTALADOR && styles.activeTabText]}>Instalador</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput style={[styles.input, errors.name != null && styles.inputError]} onChangeText={(value) => handleChange('name', value)} value={formData.name} placeholder="Ingrese su nombre" />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.inputLabel}>Apellidos</Text>
          <TextInput
            style={[styles.input, errors.surname != null && styles.inputError]}
            onChangeText={(value) => handleChange('surname', value)}
            value={formData.surname}
            placeholder="Ingrese sus surname"
          />
          {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, errors.email != null && styles.inputError]}
            onChangeText={(value) => handleChange('email', value)}
            value={formData.email}
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {userType === UserTypes.INSTALADOR && (
            <>
              <Text style={styles.inputLabel}>Nombre de organización</Text>
              <TextInput
                style={[styles.input, errors.organizacionName != null && styles.inputError]}
                onChangeText={(value) => handleChange('organizacionName', value)}
                value={formData.organizacionName}
                placeholder="Ingrese el nombre de su organización"
              />
              {errors.organizacion && <Text style={styles.errorText}>{errors.organizacion}</Text>}
            </>
          )}

          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={[styles.passwordContainer, errors.password != null && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={(value) => handleChange('password', value)}
              value={formData.password}
              placeholder="Ingrese su contraseña"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Text style={styles.inputLabel}>Confirmar contraseña</Text>
          <View style={[styles.passwordContainer, errors.confirmPassword != null && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              value={formData.confirmPassword}
              placeholder="Confirme su contraseña"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tiene una cuenta? </Text>
            <Link href={'/sign-in'}>
              <Text style={styles.loginLink}>Inicie sesión</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollView: {
    flexGrow: 1,
  },
  leftPanel: {
    height: 250,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    width: 200,
    height: 40,
  },
  welcomeText: {
    color: 'rgba(22,78,99,1)',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeSubtext: {
    color: 'rgba(22,78,99,1)',
    fontSize: 16,
    marginBottom: 20,
  },
  rightPanel: {
    padding: 20,
  },
  tabSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: '#4ade80',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#0f172a',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'gray',
  },
  loginLink: {
    color: '#3b82f6',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
