import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ConsumptionGraphData, OwnerDashboardI } from "@/types/OwnerDashboard";
import { getEnergyConsumptionToday } from "../utils/getEnergyConsumptionToday";
import { getEnergyProductionToday } from "../utils/getEnergyProductionToday";
import { getMoneyConsumptionToday } from "../utils/getMoneyConsumptionToday";
import { getMoneyProductionToday } from "../utils/getMoneyProductionToday";
import FeeTypeMoneyConsumResume from "./FeeTypeMoneyConsum";

interface EnergyMoneyResumeProps {
  data: OwnerDashboardI;
  dateData: ConsumptionGraphData;
  currentGraphMode: number;
  showPredictions: boolean;
  hasInverter: boolean;
}

const EnergyMoneyResume = React.memo(({ data, dateData, currentGraphMode, showPredictions, hasInverter }: EnergyMoneyResumeProps) => {
  const [energyConsumptionToday, setEnergyConsumptionToday] = useState("0");
  const [energyProductionToday, setEnergyProductionToday] = useState("0");
  const [moneyConsumptionToday, setMoneyConsumptionToday] = useState("0");
  const [moneyProductionToday, setMoneyProductionToday] = useState("0");

  useEffect(() => {
    console.log({ dateData });
    if (dateData && dateData.consumptionData) {
      setEnergyConsumptionToday(getEnergyConsumptionToday(dateData.consumptionData));
      setEnergyProductionToday(getEnergyProductionToday(dateData.consumptionData));
      setMoneyConsumptionToday(getMoneyConsumptionToday(dateData.consumptionData));
      setMoneyProductionToday(getMoneyProductionToday(dateData.consumptionData));
    } else if (data.consumptionList.length) {
      setEnergyConsumptionToday(getEnergyConsumptionToday(data.consumptionList));
      setEnergyProductionToday(getEnergyProductionToday(data.consumptionList));
      setMoneyConsumptionToday(getMoneyConsumptionToday(data.consumptionList));
      setMoneyProductionToday(getMoneyProductionToday(data.consumptionList));
    } else {
      setEnergyConsumptionToday("0");
      setEnergyProductionToday("0");
      setMoneyConsumptionToday("0");
      setMoneyProductionToday("0");
    }
  }, [data, dateData]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {hasInverter && (
          <>
            <View style={styles.column}>
              <Text style={styles.label}>{currentGraphMode === 1 ? "Energía" : "Energía"} comprada</Text>
              <Text style={styles.value}>
                {currentGraphMode === 1
                  ? `${+energyConsumptionToday <= 0 ? 0 : (+energyConsumptionToday).toFixed(2)} kWh`
                  : `${+moneyConsumptionToday <= 0 ? 0 : (+moneyConsumptionToday).toFixed(2)} €`}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{currentGraphMode === 1 ? "Energía" : "Energía"} volcada</Text>
              <Text style={styles.value}>
                {currentGraphMode === 1 ? `${+energyProductionToday <= 0 ? 0 : (+energyProductionToday).toFixed(2)} kWh` : `${+moneyProductionToday <= 0 ? 0 : (+moneyProductionToday).toFixed(2)} €`}
              </Text>
            </View>
          </>
        )}
        <View style={styles.column}>
          <Text style={styles.label}>{currentGraphMode === 1 ? "Energía consumida" : "Importe Total"}</Text>
          <Text style={styles.boldValue}>
            {currentGraphMode === 1
              ? `${+energyConsumptionToday - +energyProductionToday <= 0 ? 0 : (+energyConsumptionToday - +energyProductionToday).toFixed(2)} kWh`
              : `${+moneyConsumptionToday - +moneyProductionToday <= 0 ? 0 : (+moneyConsumptionToday - +moneyProductionToday).toFixed(2)} €`}
          </Text>
        </View>
      </View>
      <FeeTypeMoneyConsumResume data={data} dateData={dateData} currentGraphMode={currentGraphMode} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    width: "100%",
  },
  column: {
    flexDirection: "column",
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    fontSize: 12,
    color: "#64748B",
  },
  value: {
    fontWeight: "500",
    fontSize: 20,
    color: "#164E63",
  },
  boldValue: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#164E63",
  },
});

export default EnergyMoneyResume;
