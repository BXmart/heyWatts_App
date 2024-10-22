import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { OwnerDashboardI } from "@/types/OwnerDashboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import DottedLine from "../graphs/components/AnimatedDottedLine";

const { width } = Dimensions.get("window");
const IconHouse = () => <FontAwesome6 name="house" size={34} color="#10B981" />;
const IconSolar = () => <MaterialIcons name="solar-power" size={34} color="#10B981" />;
const IconPylon = () => <MaterialCommunityIcons name="transmission-tower" size={34} color="#10B981" />;
const IconPlug = () => <FontAwesome6 name="plug-circle-bolt" size={34} color="#10B981" />;
const IconBattery = () => <MaterialCommunityIcons name="car-battery" size={34} color="#10B981" />;

const PropertyInfograph = ({ data, hasBattery, hasInverter, isLoading }: { data: OwnerDashboardI; hasBattery: boolean; hasInverter: boolean; isLoading: boolean }) => {
  const getArrowDirection = (value: number, position: "up" | "down" | "left" | "right") => {
    if (position === "up") {
      if (value > 0) return "chevrons-up";
      if (value < 0) return "chevrons-down";
      return "minus";
    }
    if (position === "down") {
      if (value > 0) return "chevrons-down";
      if (value < 0) return "chevrons-up";
      return "minus";
    }
    if (position === "left") {
      if (value > 0) return "chevrons-left";
      if (value < 0) return "chevrons-right";
      return "minus";
    }
    if (position === "right") {
      if (value > 0) return "chevrons-right";
      if (value < 0) return "chevrons-left";
      return "minus";
    }
  };

  return (
    <View style={styles.card}>
      <Text style={{ fontSize: 14, color: "lightgray", fontWeight: "bold" }}>Resumen propiedad</Text>
      <View style={styles.container}>
        <IconHouse />
        {/* TOP */}
        {hasInverter && (
          <View style={styles.topSection}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <IconSolar />
              <Text style={[styles.text, styles.topText, (!isLoading ? data.propertyResume.production ?? 0 : 0) !== 0 && styles.animatedText]}>
                {!isLoading ? (data.propertyResume.production === 0 ? "0" : Math.abs((!isLoading ? data.propertyResume.production ?? 0 : 0) / 1000).toFixed(2)) : "0"} kW
              </Text>
            </View>
            {/* <Feather name={getArrowDirection(-data.propertyResume.production, "up")} size={24} color="#10B981" /> */}
            <DottedLine length={30} dotSize={10} dotColor="#FFFFFF" reverse={false} direction="vertical" duration={3000} />
          </View>
        )}

        {/* RIGHT */}
        <View style={styles.rightSection}>
          {/* <Feather name={getArrowDirection(-(!isLoading? data.propertyResume.production ?? 0 : 0), "right")} size={24} color="#10B981" /> */}
          <DottedLine
            style={{ top: 15, left: -40, position: "absolute" }}
            length={50}
            dotSize={10}
            dotColor="#10B981"
            reverse={-(!isLoading ? data.propertyResume.consumption ?? 0 : 0) < 0}
            direction="horizontal"
            duration={3000}
          />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <IconPylon />
            <Text style={[styles.text, styles.rightText, (!isLoading ? data.propertyResume.consumption ?? 0 : 0) !== 0 && styles.animatedText]}>
              {(!isLoading ? data.propertyResume.consumption ?? 0 : 0) === 0 ? "0" : Math.abs((!isLoading ? data.propertyResume.consumption ?? 0 : 0) / 1000).toFixed(2)} kW
            </Text>
          </View>
        </View>

        {/* BOTTOM */}
        <View style={styles.bottomSection}>
          {/* <Feather name={getArrowDirection(data.propertyResume.total_consumption, "down")} size={24} color="#10B981" /> */}
          <DottedLine
            style={{ top: -30, left: 7, position: "absolute" }}
            length={30}
            dotSize={10}
            dotColor="#10B981"
            reverse={-(!isLoading ? data.propertyResume.total_consumption ?? 0 : 0) < 0}
            direction="vertical"
            duration={3000}
          />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <IconPlug />
            <Text style={[styles.text, styles.bottomText]}>
              {!isLoading ? (data.propertyResume.total_consumption === 0 ? "0" : Math.abs(data.propertyResume.total_consumption / 1000).toFixed(2)) : "0"} kW
            </Text>
          </View>
        </View>

        {/* LEFT */}
        {hasBattery && (
          <View style={styles.leftSection}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <IconBattery />
              <Text style={[styles.text, styles.leftText, !isLoading && data.propertyResume.battery !== 0 && styles.animatedText]}>
                {!isLoading ? (data.propertyResume.battery === 0 ? "0" : Math.abs(data.propertyResume.battery / 1000).toFixed(2)) : "0"} kW
              </Text>
            </View>
            {/* <Feather name={getArrowDirection(data.propertyResume.battery, "left")} size={24} color="#10B981" /> */}
            <DottedLine
              style={{ top: 15, left: 40, position: "absolute" }}
              length={50}
              dotSize={10}
              dotColor="#10B981"
              reverse={!isLoading && data.propertyResume.battery > 0}
              direction="horizontal"
              duration={3000}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: width / 2.7,
    height: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  container: {
    width: width / 2 - 20,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 0.8 }],
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  animatedText: {
    opacity: 0.7,
  },
  topSection: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    flexDirection: "column",
  },
  rightSection: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    width: 50,
  },
  bottomSection: {
    position: "absolute",
    flexDirection: "column",
    bottom: 0,
    left: "44%",
  },
  leftSection: {
    position: "absolute",
    left: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    width: 50,
  },
  topText: {
    position: "absolute",
    top: 8,
    left: 48,
  },
  rightText: {
    position: "absolute",
    top: 40,
    right: 5,
  },
  bottomText: {
    backgroundColor: "#083344",
    padding: 5,
    borderRadius: 8,
    fontSize: 17,
    fontWeight: "500",
    position: "absolute",
    top: 8,
    left: 48,
  },
  leftText: {
    position: "absolute",
    top: 40,
    left: -3,
  },
});

export default PropertyInfograph;
