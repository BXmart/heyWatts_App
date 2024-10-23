import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

// Type definitions
interface ConsumptionInfoProps {
  label: string;
  preValue: number;
  postValue?: number;
  unit: string;
  details: {
    startDate?: string;
    endDate?: string;
  };
}

// Date formatting utility function remains the same
const formatProposalDates = (date: string): string => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Date formatting error:", error);
    return date;
  }
};

export const ConsumptionInfo: React.FC<ConsumptionInfoProps> = ({ label, preValue, postValue, unit, details }) => {
  const getDateRangeText = () => {
    if (!details.startDate) return "";

    const formattedStartDate = formatProposalDates(details.startDate);
    const formattedEndDate = details.endDate && formatProposalDates(details.endDate);

    if (details.startDate === details.endDate) {
      return ` desde ${formattedStartDate}`;
    }
    return ` desde ${formattedStartDate} hasta ${formattedEndDate}`;
  };

  const ValueDisplay = ({ value, isNegative }: { value: number; isNegative: boolean }) => (
    <View style={styles.valueContainer}>
      <Text style={[styles.value, isNegative ? styles.negativeValue : styles.positiveValue]}>
        {value}
        <Text style={[styles.unit, isNegative ? styles.negativeUnit : styles.positiveUnit]}>{unit}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.dateRange}>{getDateRangeText()}</Text>
      </Text>

      <View style={styles.valuesRow}>
        <ValueDisplay value={preValue} isNegative={true} />

        {postValue !== undefined && (
          <>
            <View style={styles.arrowContainer}>
              <AntDesign name="arrowright" size={20} color="#DBFFE8" />
            </View>
            <ValueDisplay value={postValue} isNegative={false} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: "#083344", // deepBlue
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#DBFFE8", // mintGreen
    marginBottom: 4,
    opacity: 0.9,
  },
  dateRange: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    opacity: 0.7,
  },
  valuesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
  },
  positiveValue: {
    color: "#DBFFE8", // mintGreen
  },
  negativeValue: {
    color: "#EF4444", // keeping red for negative values
  },
  unit: {
    fontSize: 12,
    marginLeft: 2,
  },
  positiveUnit: {
    color: "#DBFFE8", // mintGreen
    opacity: 0.8,
  },
  negativeUnit: {
    color: "#EF4444", // keeping red for negative values
    opacity: 0.8,
  },
  arrowContainer: {
    marginHorizontal: 8,
    transform: [{ rotate: "0deg" }],
  },
});

export default ConsumptionInfo;
