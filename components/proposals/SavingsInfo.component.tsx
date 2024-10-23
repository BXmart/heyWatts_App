import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SavingsInfoProps {
  label: string;
  value: number | string;
  unit: string;
  customStyles?: {
    container?: object;
    label?: object;
    value?: object;
    unit?: object;
  };
}

export const SavingsInfo: React.FC<SavingsInfoProps> = ({ label, value, unit, customStyles = {} }) => {
  // Format the value to 2 decimal places
  const formattedValue = parseFloat(value?.toString() || "0").toFixed(2);

  return (
    <View style={[styles.container, customStyles.container]}>
      <Text style={[styles.label, customStyles.label]}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, customStyles.value]}>
          {formattedValue}
          <Text style={[styles.unit, customStyles.unit]}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    backgroundColor: "#035170", // lightBlue
    padding: 8,
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    marginBottom: 4,
    opacity: 0.8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  unit: {
    fontSize: 12,
    marginLeft: 2,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
});

export default SavingsInfo;
