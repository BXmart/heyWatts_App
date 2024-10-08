import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const OwnerDashboardTodayMoneyCard = ({ invoiceData, openModal }: any) => {
  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.headerText}>Factura a día de hoy</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.totalCost}>
          {invoiceData?.actual?.totalCost?.toFixed(2) || "0.00"}
          <Text style={styles.currencySymbol}>€</Text>
        </Text>
        <View style={styles.detailsContainer}>
          <View>
            <Text style={styles.costItem}>
              <Text style={styles.costValue}>{invoiceData?.actual?.powerTermCost?.toFixed(2) || "0.00"}</Text>
              <Text style={styles.costUnit}>€ </Text>
              <Text style={styles.costLabel}>Término Potencia</Text>
            </Text>
            <Text style={styles.costItem}>
              <Text style={styles.costValue}>{invoiceData?.actual?.energyTermCost?.toFixed(2) || "0.00"}</Text>
              <Text style={styles.costUnit}>€ </Text>
              <Text style={styles.costLabel}>Término Energía</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => openModal(true, "actual")} style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#10B981" />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
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
  totalCost: {
    fontSize: 28,
    fontWeight: "500",
    color: "#10B981",
    marginBottom: -8,
  },
  currencySymbol: {
    marginLeft: 4,
    fontSize: 14,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  costItem: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  costValue: {
    fontWeight: "500",
  },
  costUnit: {
    fontWeight: "normal",
    marginRight: 4,
  },
  costLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  helpButton: {
    alignSelf: "flex-end",
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    right: 16,
  },
});

export default OwnerDashboardTodayMoneyCard;
