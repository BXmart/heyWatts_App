import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonLoader = ({ width, height, style }: any) => (
  <View style={[{ width, height, borderRadius: 4, overflow: "hidden" }, style]}>
    <LinearGradient colors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.3)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { transform: [{ translateX: -100 }] }]}
        />
      </View>
    </LinearGradient>
  </View>
);

const LoadingScreen = () => (
  <View style={styles.container}>
    <SkeletonLoader width={200} height={20} style={styles.title} />
    <SkeletonLoader width={300} height={15} style={styles.subtitle} />
    <View style={styles.content}>
      <SkeletonLoader width="100%" height={100} style={styles.card} />
      <SkeletonLoader width="100%" height={100} style={styles.card} />
      <SkeletonLoader width="100%" height={100} style={styles.card} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  card: {
    marginBottom: 15,
  },
});

export default LoadingScreen;
