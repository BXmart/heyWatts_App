import * as React from "react";
import { Dimensions, View, StyleSheet, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { Colors, TimeSlot } from "../../utils/circularTimeRangeUtils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const CircularTimeRangeWrapper = ({ slots, type }: { slots: TimeSlot[]; type: "energy" | "comp" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circularTimeRangeContainer}>
        <CircularTimeRange slots={slots} />
      </View>
      <View style={styles.legendContainer}>
        {type === "energy" ? (
          <>
            <LegendItem color={Colors.MODERATE} label="<0.05€" />
            <LegendItem color={Colors.STANDARD} label="<0.10€" />
            <LegendItem color={Colors.HIGH} label=">0.18€" />
            <LegendItem color={Colors.CRITICAL} label=">0.23€" />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "baseline",
                width: 100,
                position: "absolute",
                right: "50%",
                bottom: 0,
                backgroundColor: "#083344",
                padding: 5,
                borderRadius: 8,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#DBFFE8",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                € Energía
              </Text>
              <FontAwesome6 name="plug-circle-exclamation" size={20} color="#10B981" />
            </View>
          </>
        ) : (
          <>
            <LegendItem color={Colors.SURPLUS_COMPENSATION_NONE} label="=0.00€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_LOW} label="<0.04€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_MODERATE} label="<0.08€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_HIGH} label=">0.08€" />

            <View
              style={{
                flexWrap: "nowrap",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "baseline",
                width: 100,
                position: "absolute",
                right: "50%",
                bottom: 0,
                backgroundColor: "#083344",
                padding: 5,
                borderRadius: 8,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#DBFFE8",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                € Excedentes
                <MaterialIcons name="solar-power" size={24} color="#10B981" />
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  circularTimeRangeContainer: {
    flex: 2,
  },
  legendContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
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
});

export default CircularTimeRangeWrapper;
