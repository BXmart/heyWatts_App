import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  Pressable,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, router } from "expo-router";
import LoginButton from "@/components/sign-in/LoginButton";
import { URLS } from "@/utils/constants";
import useAuthStore from "@/stores/useAuthStore";

export default function SignInPage() {
  const { userInfo, loading, error, success, login, logout, register } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (!result || result.error) {
      alert(result.message ?? "");
    } else {
      router.replace(URLS.APP_INDEX);
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
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.welcomeSubtext}>
              Comience a gestionar su energía de manera inteligente y con
              eficiencia.
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.rightPanel}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
          />

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

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>
              ¿Ha olvidado la contraseña?
            </Text>
          </TouchableOpacity>

          <LoginButton
            style={{
              loginButtonContainer: styles.buttonContainer,
              loginButton: styles.loginButton,
              loginButtonText: styles.loginButtonText,
            }}
            loginFunction={handleLogin}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>¿No tiene una cuenta? </Text>
            <Link href={"/sign-up"}>
              <Text style={styles.signupLink}>Regístrese.</Text>
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
    backgroundColor: "#f0f9ff",
  },
  scrollView: {
    flexGrow: 1,
  },
  leftPanel: {
    height: 250, // Adjust as needed
  },
  gradient: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 14,
  },
  slogan: {
    color: "rgba(22,78,99,1)",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subSlogan: {
    color: "rgba(22,78,99,1)",
    fontWeight: "semibold",
    fontSize: 14,
  },
  rightPanel: {
    padding: 20,
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
  forgotPassword: {
    color: "#3b82f6",
    textAlign: "right",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  googleButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
  },
  googleButtonText: {
    color: "black",
  },
  loginButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#0f172a",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "gray",
  },
  signupLink: {
    color: "#3b82f6",
  },
});
