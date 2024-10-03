import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { URLS } from "@/utils/constants";
import useAuthStore, { RegisterData } from "@/stores/useAuthStore";

export default function RegisterPage() {
  const { register } = useAuthStore();
  const [userType, setUserType] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizacion, setOrganizacion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (formData: RegisterData) => {
    try {
      const result = await register(formData);
      if (result.error) {
        // Handle registration error
        console.error(result.message);
      } else {
        // Registration successful
        console.log("Registered successfully", result);
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.leftPanel}>
          <LinearGradient
            colors={["#4ade80", "#22c55e"]}
            style={styles.gradient}
          >
            <Image
              width={100}
              source={require("@/assets/branding/hw-logo-hor-dark-01.png")}
              style={styles.logo}
            />
            <Text style={styles.welcomeText}>¡Regístrate!</Text>
            <Text style={styles.welcomeSubtext}>
              Únete a nosotros para gestionar tu energía de manera inteligente y
              eficiente.
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.rightPanel}>
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tab, userType === "usuario" && styles.activeTab]}
              onPress={() => setUserType("usuario")}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === "usuario" && styles.activeTabText,
                ]}
              >
                Usuario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                userType === "instalador" && styles.activeTab,
              ]}
              onPress={() => setUserType("instalador")}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === "instalador" && styles.activeTabText,
                ]}
              >
                Instalador
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNombre}
            value={nombre}
            placeholder="Ingrese su nombre"
          />

          <Text style={styles.inputLabel}>Apellidos</Text>
          <TextInput
            style={styles.input}
            onChangeText={setApellidos}
            value={apellidos}
            placeholder="Ingrese sus apellidos"
          />

          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
          />

          {userType === "instalador" && (
            <>
              <Text style={styles.inputLabel}>Nombre de organización</Text>
              <TextInput
                style={styles.input}
                onChangeText={setOrganizacion}
                value={organizacion}
                placeholder="Ingrese el nombre de su organización"
              />
            </>
          )}

          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={setPassword}
              value={password}
              placeholder="Ingrese su contraseña"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Confirmar contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirme su contraseña"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => handleSubmit}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tiene una cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace(URLS.SIGN_IN)}>
              <Link href={"/sign-in"}>
                <Text style={styles.loginLink}>Inicie sesión</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
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
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    width: 200,
    height: 40,
  },
  welcomeText: {
    color: "rgba(22,78,99,1)",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  welcomeSubtext: {
    color: "rgba(22,78,99,1)",
    fontSize: 16,
    marginBottom: 20,
  },
  rightPanel: {
    padding: 20,
  },
  tabSelector: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#4ade80",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4ade80",
    fontWeight: "bold",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
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
    backgroundColor: "#0f172a",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "gray",
  },
  loginLink: {
    color: "#3b82f6",
  },
});
