import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const SkeletonLoader = ({ width, height, style }: any) => (
  <View style={[{ width, height, borderRadius: 4, overflow: "hidden" }, style]}>
    <LinearGradient colors={["#035170", "#035170", "#035170"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={["#DBFFE8", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { transform: [{ translateX: -100 }] }]} />
      </View>
    </LinearGradient>
  </View>
);

const LoadingScreen = () => (
  <View style={styles.container}>
    <View style={{ flexDirection: "row", height: width / 2, gap: 20 }}>
      <SkeletonLoader style={{ flex: 1 }} height={width / 2} />
      <SkeletonLoader style={{ flex: 1 }} height={width / 2} />
    </View>
    <View style={styles.content}>
      <SkeletonLoader width="100%" height={100} style={styles.card} />
      <SkeletonLoader width="100%" height={300} style={styles.card} />
      <SkeletonLoader width="100%" height={100} style={styles.card} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    flexDirection: "column",
    padding: 20,
    marginTop: 100,
    gap: 20,
    backgroundColor: "#0F242A", // background-default
  },
  content: {
    flex: 1,
  },
  card: {
    marginBottom: 15,
  },
});

export default LoadingScreen;
