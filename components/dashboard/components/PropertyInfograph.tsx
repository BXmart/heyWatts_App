import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { OwnerDashboardI } from "@/types/OwnerDashboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");
const IconHouse = () => <FontAwesome6 name="house" size={24} color="black" />;
const IconSolar = () => <MaterialIcons name="solar-power" size={24} color="black" />;
const IconPylon = () => <MaterialCommunityIcons name="transmission-tower" size={24} color="black" />;
const IconEnergy = () => <SimpleLineIcons name="energy" size={24} color="black" />;
const IconBattery = () => <MaterialCommunityIcons name="car-battery" size={24} color="black" />;

const PropertyInfograph = ({ data, hasBattery, hasInverter }: { data: OwnerDashboardI; hasBattery: boolean; hasInverter: boolean }) => {
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

  if (hasBattery && hasInverter) {
    return (
      <View style={styles.card}>
        <View style={styles.container}>
          <IconHouse />
          {/* TOP */}
          <View style={styles.topSection}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <IconSolar />
              <Text style={[styles.text, styles.topText, data.propertyResume.production !== 0 && styles.animatedText]}>
                {data.propertyResume.production === 0 ? "0" : Math.abs(data.propertyResume.production / 1000).toFixed(2)} kW
              </Text>
            </View>
            <Feather name={getArrowDirection(-data.propertyResume.production, "up")} size={24} color="black" />
          </View>

          {/* RIGHT */}
          <View style={styles.rightSection}>
            <Feather name={getArrowDirection(-data.propertyResume.consumption, "right")} size={24} color="black" />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <IconPylon />
              <Text style={[styles.text, styles.rightText, data.propertyResume.consumption !== 0 && styles.animatedText]}>
                {data.propertyResume.consumption === 0 ? "0" : Math.abs(data.propertyResume.consumption / 1000).toFixed(2)} kW
              </Text>
            </View>
          </View>

          {/* BOTTOM */}
          <View style={styles.bottomSection}>
            <Feather name={getArrowDirection(data.propertyResume.total_consumption, "down")} size={24} color="black" />

            <Text style={[styles.text, styles.bottomText]}>{data.propertyResume.total_consumption === 0 ? "0" : Math.abs(data.propertyResume.total_consumption / 1000).toFixed(2)} kW</Text>
          </View>

          {/* LEFT */}
          <View style={styles.leftSection}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <IconBattery />
              <Text style={[styles.text, styles.leftText, data.propertyResume.battery !== 0 && styles.animatedText]}>
                {data.propertyResume.battery === 0 ? "0" : Math.abs(data.propertyResume.battery / 1000).toFixed(2)} kW
              </Text>
            </View>
            <Feather name={getArrowDirection(data.propertyResume.battery, "left")} size={24} color="black" />
          </View>
        </View>
      </View>
    );
  }
  // Add similar code for other conditions (hasInverter && !hasBattery, !hasInverter, etc.)
};

const styles = StyleSheet.create({
  card: {
    width: width / 2.7,
    padding: 5,
    maxHeight: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    width: width / 2 - 20,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 0.8 }],
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
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
    right: -8,
  },
  bottomText: {},
  leftText: {
    position: "absolute",
    top: 40,
    left: 0,
  },
});

export default PropertyInfograph;
