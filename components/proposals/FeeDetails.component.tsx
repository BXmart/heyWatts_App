import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FeeDetailsProps {
  details: any;
  isOpt?: boolean;
}

export const FeeDetails: React.FC<FeeDetailsProps> = ({ details, isOpt = false }) => {
  // Helper function to check if fee type is valid
  const isValidFeeType = (feeType: number) => {
    return [1, 3, 5, 6].includes(feeType);
  };

  // Check if we should show the no information message
  if ((isOpt && !isValidFeeType(details.feeTypeOpt)) || (!isOpt && !isValidFeeType(details.feeTypeNoOpt))) {
    return <Text style={styles.noInfoText}>No hay información de esta tarifa actualmente</Text>;
  }

  const Type1Fee = () => (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P1: {details.p1Amount ?? 0}€</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P2: {details.p2Amount ?? 0}€</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P3: {details.p3Amount ?? 0}€</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P4: {details.p4Amount ?? 0}€</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P5: {details.p5Amount ?? 0}€</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.amountText}>P6: {details.p6Amount ?? 0}€</Text>
        </View>
      </View>
    </View>
  );

  const Type3Fee = () => (
    <View style={styles.singleContainer}>
      <Text style={styles.totalAmountText}>Importe: {details.totalAmount}€</Text>
    </View>
  );

  const Type5Fee = () => (
    <View style={styles.periodContainer}>
      <Text style={[styles.periodText, styles.peakText]}>Punta: {details.peakAmountOPT ?? 0}€</Text>
      <Text style={[styles.periodText, styles.flatText]}>Llano: {details.flatAmountOPT ?? 0}€</Text>
      <Text style={[styles.periodText, styles.valleyText]}>Valle: {details.valleyAmountOPT ?? 0}€</Text>
    </View>
  );

  const Type6Fee = () => (
    <View style={styles.periodContainer}>
      <Text style={[styles.periodText, styles.peakText]}>Punta: {details.peakAmountOPT ?? 0}€</Text>
      <Text style={[styles.periodText, styles.valleyText]}>Valle: {details.valleyAmountOPT ?? 0}€</Text>
    </View>
  );

  const currentFeeType = isOpt ? details.feeTypeOpt : details.feeTypeNoOpt;

  return (
    <View style={styles.container}>
      {currentFeeType === 1 && <Type1Fee />}
      {currentFeeType === 3 && <Type3Fee />}
      {currentFeeType === 5 && <Type5Fee />}
      {currentFeeType === 6 && <Type6Fee />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#083344", // deepBlue
    borderRadius: 8,
  },
  noInfoText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
  gridContainer: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#035170", // lightBlue
    padding: 8,
    borderRadius: 6,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
    textAlign: "center",
  },
  singleContainer: {
    backgroundColor: "#035170", // lightBlue
    padding: 12,
    borderRadius: 8,
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22C55E", // green
  },
  periodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  periodText: {
    fontSize: 16,
    fontWeight: "600",
  },
  peakText: {
    color: "#EF4444", // red
  },
  flatText: {
    color: "#F97316", // orange
  },
  valleyText: {
    color: "#22C55E", // green
  },
});

export default FeeDetails;
