import { convertWattsToHours } from "@/utils";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FEETYPES_LIST } from "../../utils/feeTypes";
import { ConsumptionGraphData, OwnerDashboardI } from "@/types/OwnerDashboard";

const FeeTypeMoneyConsumResume = ({ data, dateData, currentGraphMode }: { data: OwnerDashboardI; dateData: ConsumptionGraphData; currentGraphMode: number }) => {
  const [totalTip, setTotalTip] = useState("0");
  const [totalValley, setTotalValley] = useState("0");
  const [totalFlat, setTotalFlat] = useState("0");
  const [totalTipKwh, setTotalTipKwh] = useState("0");
  const [totalValleyKwh, setTotalValleyKwh] = useState("0");
  const [totalFlatKwh, setTotalFlatKwh] = useState("0");
  const [lastConsumItem, setLastConsumItem] = useState(null);

  useEffect(() => {
    if (data.consumptionList.length && !(dateData && dateData.consumptionData)) {
      const tempTotalTip = data.consumptionList.reduce((acc, current) => (acc += current.tip > 0 ? current.tip : 0), 0).toFixed(2);
      setTotalTip(tempTotalTip);
      const tempTotalValley = data.consumptionList.reduce((acc, current) => (acc += current.valley > 0 ? current.valley : 0), 0).toFixed(2);
      setTotalValley(tempTotalValley);
      const tempTotalFlat = data.consumptionList.reduce((acc, current) => (acc += current.flat > 0 ? current.flat : 0), 0).toFixed(2);
      setTotalFlat(tempTotalFlat);
      setLastConsumItem(data.consumptionList[data.consumptionList.length - 1]);

      const tempTotalTipKwh = data.consumptionList.reduce((acc, current) => (acc += current.tip > 0 ? current.net : 0), 0);
      setTotalTipKwh(convertWattsToHours(tempTotalTipKwh).split(" ")[0]);
      const tempTotalValleyKwh = data.consumptionList.reduce((acc, current) => (acc += current.valley > 0 ? current.net : 0), 0);
      setTotalValleyKwh(convertWattsToHours(tempTotalValleyKwh).split(" ")[0]);
      const tempTotalFlatKwh = data.consumptionList.reduce((acc, current) => (acc += current.flat > 0 ? current.net : 0), 0);
      setTotalFlatKwh(convertWattsToHours(tempTotalFlatKwh).split(" ")[0]);
    } else if (!!dateData) {
      const tempTotalTip = dateData.consumptionData.reduce((acc, current) => (acc += current.tip > 0 ? current.tip : 0), 0).toFixed(2);
      setTotalTip(tempTotalTip);
      const tempTotalValley = dateData.consumptionData.reduce((acc, current) => (acc += current.valley > 0 ? current.valley : 0), 0).toFixed(2);
      setTotalValley(tempTotalValley);
      const tempTotalFlat = dateData.consumptionData.reduce((acc, current) => (acc += current.flat > 0 ? current.flat : 0), 0).toFixed(2);
      setTotalFlat(tempTotalFlat);

      const tempTotalTipKwh = dateData.consumptionData.reduce((acc, current) => (acc += current.tip > 0 ? current.net : 0), 0);
      setTotalTipKwh(convertWattsToHours(tempTotalTipKwh).split(" ")[0]);
      const tempTotalValleyKwh = dateData.consumptionData.reduce((acc, current) => (acc += current.valley > 0 ? current.net : 0), 0);
      setTotalValleyKwh(convertWattsToHours(tempTotalValleyKwh).split(" ")[0]);
      const tempTotalFlatKwh = dateData.consumptionData.reduce((acc, current) => (acc += current.flat > 0 ? current.net : 0), 0);
      setTotalFlatKwh(convertWattsToHours(tempTotalFlatKwh).split(" ")[0]);
      setLastConsumItem(dateData.consumptionData[dateData.consumptionData.length - 1]);
    } else {
      setTotalTip("0");
      setTotalValley("0");
      setTotalFlat("0");
      setTotalTipKwh("0");
      setTotalValleyKwh("0");
      setTotalFlatKwh("0");
      setLastConsumItem(null);
    }
  }, [dateData, data]);

  const feetypeText =
    lastConsumItem?.feeType && FEETYPES_LIST.filter((item) => item.id === lastConsumItem.feeType).length > 0
      ? FEETYPES_LIST.filter((item) => item.id === lastConsumItem.feeType)[0].description
      : "Sin datos";

  return (
    <View>
      {feetypeText !== "Sin datos" && (
        <View style={styles.container}>
          {[1, 5, 6].includes(lastConsumItem.feeType) && (
            <View style={styles.itemContainer}>
              <Text style={styles.label}>{currentGraphMode == 0 ? "Importe Punta" : "Energía en Punta"}</Text>
              <Text style={[styles.value, styles.redText]}>{currentGraphMode == 0 ? `${totalTip || 0}€` : `${totalTipKwh || 0}kWh`}</Text>
            </View>
          )}
          {[1, 5].includes(lastConsumItem.feeType) && (
            <View style={styles.itemContainer}>
              <Text style={styles.label}>{currentGraphMode == 0 ? "Importe Llano" : "Energía en Llano"}</Text>
              <Text style={[styles.value, styles.orangeText]}>{currentGraphMode == 0 ? `${totalFlat || 0}€` : `${totalFlatKwh || 0}kWh`}</Text>
            </View>
          )}
          {[1, 5, 6].includes(lastConsumItem.feeType) && (
            <View style={styles.itemContainer}>
              <Text style={styles.label}>{currentGraphMode == 0 ? "Importe Valle" : "Energía en Valle"}</Text>
              <Text style={[styles.value, styles.greenText]}>{currentGraphMode == 0 ? `${totalValley || 0}€` : `${totalValleyKwh || 0}kWh`}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
  },
  itemContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  value: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 8,
  },
  redText: {
    color: "#ef4444",
  },
  orangeText: {
    color: "#f97316",
  },
  greenText: {
    color: "#22c55e",
  },
});

export default FeeTypeMoneyConsumResume;
