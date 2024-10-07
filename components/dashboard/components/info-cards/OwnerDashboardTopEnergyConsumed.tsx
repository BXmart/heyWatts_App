import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

// You'll need to implement these functions or import them from your lib
import { calculatePercentageChange, convertWattsToHours } from "@/utils";
import { InvoiceData } from "@/services/dashboard.service";

const ComparisonRow: React.FC<{
  compareValue: number;
  convertedValue: string;
  percentageChange: string;
  comparisonText: string;
  noDataText: string;
}> = ({ compareValue, convertedValue, percentageChange, comparisonText, noDataText }) => {
  if (compareValue === 0) {
    return <Text style={styles.noDataText}>{noDataText}</Text>;
  }

  const [value, unit] = convertedValue.split(" ");
  const isPositive = compareValue > 0;

  return (
    <View style={styles.comparisonRow}>
      <Text style={[styles.changeIcon, isPositive ? styles.increaseText : styles.decreaseText]}>{isPositive ? "▲" : "▼"}</Text>
      <Text style={[styles.changeValue, isPositive ? styles.increaseText : styles.decreaseText]}>
        {value}
        <Text style={styles.unitText}> {unit} </Text>
        <Text style={styles.comparisonText}>
          ({percentageChange}%) {comparisonText}
        </Text>
      </Text>
    </View>
  );
};

const OwnerDashboardTopEnergyConsumedCard = ({ invoiceData }: { invoiceData: InvoiceData }) => {
  const { energyKwLastCicle, energyKwActualCicle, energyKwActualWeek, energyKwLastWeek } = invoiceData?.comparative;

  const compareMonthConsumption = energyKwActualCicle - energyKwLastCicle;
  const compareWeekConsumption = energyKwActualWeek - energyKwLastWeek;

  const percentageMonthConsumption = calculatePercentageChange(energyKwActualCicle, energyKwLastCicle);
  const percentageWeekConsumption = calculatePercentageChange(energyKwActualWeek, energyKwLastWeek);

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.headerText}>Consumo mes en energía</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.mainNumber}>
            {(energyKwActualCicle < 0 ? "-" : "") + convertWattsToHours(energyKwActualCicle * 1000).split(" ")[0]}
            <Text style={styles.unitText}>{" " + convertWattsToHours(energyKwActualCicle * 1000).split(" ")[1]}</Text>
          </Text>

          <View style={styles.comparisonsContainer}>
            <ComparisonRow
              compareValue={compareMonthConsumption}
              convertedValue={convertWattsToHours(Math.abs(compareMonthConsumption) * 1000)}
              percentageChange={percentageMonthConsumption}
              comparisonText="mes pasado"
              noDataText="Sin datos del mes pasado"
            />

            <ComparisonRow
              compareValue={compareWeekConsumption}
              convertedValue={convertWattsToHours(Math.abs(compareWeekConsumption) * 1000)}
              percentageChange={percentageWeekConsumption}
              comparisonText="semana pasada"
              noDataText="Sin datos de la semana pasada"
            />
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="flash-outline" size={24} color="#10B981" />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 140,
    padding: 16,
    position: "relative",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 4,
  },
  contentContainer: {
    flexDirection: "column",
    gap: 8,
  },
  mainNumber: {
    fontSize: 28,
    fontWeight: "500",
    color: "#10B981",
    marginBottom: -8,
  },
  unitText: {
    fontSize: 14,
    marginLeft: 4,
  },
  comparisonsContainer: {
    flexDirection: "column",
    minWidth: 96,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  comparisonText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  increaseText: {
    color: "#EF4444",
  },
  decreaseText: {
    color: "#10B981",
  },
  noDataText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    right: 16,
  },
});

export default OwnerDashboardTopEnergyConsumedCard;
