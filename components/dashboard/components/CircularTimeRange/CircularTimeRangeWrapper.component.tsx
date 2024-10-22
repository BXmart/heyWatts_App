import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Text, Pressable } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { Colors, TimeSlot } from "../../utils/circularTimeRangeUtils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { AntDesign } from "@expo/vector-icons";

const CircularTimeRangeWrapper = ({ slots, type }: { slots: TimeSlot[]; type: "energy" | "comp" }) => {
  const [showLegend, setShowLegend] = useState(false);
  const priceRanges = {
    energy: [
      { color: Colors.MODERATE, label: "<0.05€" },
      { color: Colors.STANDARD, label: "<0.10€" },
      { color: Colors.HIGH, label: ">0.18€" },
      { color: Colors.CRITICAL, label: ">0.23€" },
    ],
    comp: [
      { color: Colors.SURPLUS_COMPENSATION_NONE, label: "=0.00€" },
      { color: Colors.SURPLUS_COMPENSATION_LOW, label: "<0.04€" },
      { color: Colors.SURPLUS_COMPENSATION_MODERATE, label: "<0.08€" },
      { color: Colors.SURPLUS_COMPENSATION_HIGH, label: ">0.08€" },
    ],
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  // Get unique colors from slots
  const uniqueColors = slots ? [...new Set(slots.map((slot) => slot.color))] : [];

  const relevantPriceRanges = priceRanges[type].filter((range) => uniqueColors.includes(range.color));

  return (
    <Pressable onPress={toggleLegend}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{type === "energy" ? "Precio energía" : "Precio Excedentes"}</Text>
          {type === "energy" ? <FontAwesome6 name="plug-circle-exclamation" size={20} color="#10B981" /> : <MaterialIcons name="solar-power" size={24} color="#10B981" />}
        </View>
        <View style={styles.circularTimeRangeContainer}>
          <CircularTimeRange slots={slots} />
          <Feather name="info" size={24} color="#DBFFE8" style={styles.infoIconContainer} />
        </View>
        {showLegend && (
          <View style={styles.legendPopup}>
            <View style={styles.legendHeader}>
              <Text style={styles.legendTitle}>Leyenda</Text>
              <Pressable onPress={toggleLegend}>
                <AntDesign name="close" size={20} color="#DBFFE8" />
              </Pressable>
            </View>
            {relevantPriceRanges.map((range, index) => (
              <View style={styles.legendItem} key={index}>
                <View style={[styles.colorDot, { backgroundColor: range.color, borderColor: "lightgray", borderWidth: 1 }]} />
                <Text style={styles.legendLabel}>{range.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    /*  backgroundColor: "#083344", */
    padding: 5,
    borderRadius: 8,
    gap: 5,
    top: 15,
  },
  circularTimeRangeContainer: {
    position: "relative",
    width: "100%",
  },
  infoIconContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
    borderRadius: 12,
    padding: 4,
  },
  legendPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -100 }],
    backgroundColor: "#083344",
    padding: 16,
    borderRadius: 12,
    width: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#10B981",
    paddingBottom: 8,
  },
  legendTitle: {
    color: "#DBFFE8",
    fontSize: 14,
    fontWeight: "600",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    color: "#DBFFE8",
    fontSize: 12,
  },
  titleText: {
    textAlign: "center",
    fontSize: 14,
    color: "lightgray",
    fontWeight: "bold",
  },
});

export default CircularTimeRangeWrapper;
