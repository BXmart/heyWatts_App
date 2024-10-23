import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FeeDetails } from "./FeeDetails.component";
import { FEETYPES_LIST } from "@/utils/feeTypes";

interface ComparisonFeeProps {
  details: any;
  isWorseThanCurrentTarif: boolean;
}

export const ComparisonFee: React.FC<ComparisonFeeProps> = ({ details, isWorseThanCurrentTarif }) => {
  // Helper function to get fee type description
  const getFeeTypeDescription = (feeType: number) => {
    const feeTypeInfo = FEETYPES_LIST.find((item) => item.id === feeType);
    return feeTypeInfo?.description || "desconocida";
  };

  const CurrentTariffInfo = () => (
    <Text style={styles.text}>
      Tu tarifa de distribución es <Text style={styles.highlight}>{details.codeFare || "desconocida"}</Text>
    </Text>
  );

  const WorseCurrentTariff = () => (
    <View style={styles.container}>
      <CurrentTariffInfo />
      <Text style={styles.text}>
        . Viendo tus consumos, hemos encontrado otra con la que se han realizado los cálculos de ahorro. Tarifa comercial{" "}
        <Text style={styles.highlight}>{getFeeTypeDescription(details.feeTypeNoOpt)}</Text> en base a los siguientes precios promedio de tarifas comerciales:
      </Text>

      <View style={styles.detailsContainer}>
        <FeeDetails details={details} />
      </View>
    </View>
  );

  const BetterTariff = () => (
    <View style={styles.container}>
      <CurrentTariffInfo />
      <Text style={styles.text}>
        , con una tarifa comercial <Text style={styles.highlight}>{getFeeTypeDescription(details.feeTypeNoOpt)}</Text> con los siguientes importes
      </Text>

      <View style={styles.detailsContainer}>
        <FeeDetails details={details} />
      </View>
    </View>
  );

  return isWorseThanCurrentTarif ? <WorseCurrentTariff /> : <BetterTariff />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#083344", // deepBlue
    padding: 16,
    borderRadius: 8,
    maxWidth: "100%",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
  highlight: {
    fontWeight: "600",
    color: "#22C55E", // green
  },
  detailsContainer: {
    marginTop: 12,
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 8,
  },
});

export default ComparisonFee;
