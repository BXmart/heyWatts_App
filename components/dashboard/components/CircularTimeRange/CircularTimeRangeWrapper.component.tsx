import * as React from "react";
import { Dimensions, View, StyleSheet, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CircularTimeRange from "./CircularTimeRange.component";
import { Colors, TimeSlot } from "../../utils/circularTimeRangeUtils";
import { Modal } from "react-native-paper";

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
            <LegendItem color={Colors.LOW} label="€" />
            <LegendItem color={Colors.MODERATE} label="€€" />
            <LegendItem color={Colors.STANDARD} label="€€€" />
            <LegendItem color={Colors.HIGH} label="€€€€" />
            <LegendItem color={Colors.CRITICAL} label="€€€€€" />
          </>
        ) : (
          <>
            <LegendItem color={Colors.SURPLUS_COMPENSATION_NONE} label="€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_LOW} label="€€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_MODERATE} label="€€€" />
            <LegendItem color={Colors.SURPLUS_COMPENSATION_HIGH} label="€€€€" />
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
    fontSize: 12,
  },
});

export default CircularTimeRangeWrapper;
