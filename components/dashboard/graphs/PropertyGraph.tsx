import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { useDayHistoricGraph } from "@/hooks/property/useDayHistoricGraph";
import { Dropdown } from "react-native-element-dropdown";
import { parseData } from "../utils/parsePropertyGraphData";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import SignalSelectorModal from "./components/SignalSelector.modal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_PADDING = 32;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;

const PropertyGraph = React.memo(() => {
  const { data, isLoading, availableDates, selectedDay, setSelectedDay, availableHours } = useDayHistoricGraph();
  const [availableSignals, setAvailableSignals] = useState<any>();
  const [selectedSignals, setSelectedSignals] = useState(["totalConsumption"]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (data && data.historicDevices) {
      const signals = data.historicDevices.map((device: any) => ({
        label: device.name,
        value: device.name,
        id: device.name,
      }));

      const allSignals = [
        { label: "Vuelco a red eléctrica", value: "negativeConsumption", id: "negativeConsumption" },
        { label: "Consumo de red eléctrica", value: "positiveConsumption", id: "positiveConsumption" },
        { label: "Producción fotovoltaica", value: "productionCleanVat", id: "productionCleanVat" },
        { label: "Consumo total", value: "totalConsumption", id: "totalConsumption" },
        ...signals,
      ];
      setAvailableSignals(allSignals);
    }
  }, [data]);

  useEffect(() => {
    if (data && selectedSignals) {
      console.log(selectedSignals);
      const auxData = parseData(data, selectedSignals);

      const dataArray = [
        { data: auxData.totalConsumption, color: "red" },
        { data: auxData.positiveConsumption, color: "green" },
        { data: auxData.negativeConsumption, color: "orange" },
        { data: auxData.productionCleanVat, color: "#164E63" },
        { data: auxData.totalConsumption, color: "blue" },
      ];
      dataArray.push(
        ...Object.keys(auxData.historicDevices).map((key) => {
          return { data: auxData.historicDevices[key], color: "yellow" };
        })
      );

      setParsedData([...dataArray]);
    }
  }, [data, selectedSignals]);

  useEffect(() => {
    console.log({ selectedSignals });
  }, [selectedSignals]);

  const handleSelectDate = useCallback(
    (date: any) => {
      setSelectedDay(date.value);
    },
    [setSelectedDay]
  );

  const showOrHidePointer = (hour: number) => {
    if (scrollRef.current) {
      scrollRef.current!.scrollTo({
        x: hour * 3000,
        animated: true,
      });
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#164E63" />;

  return (
    <ScrollView style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={availableDates}
        labelField="label"
        valueField="value"
        value={selectedDay}
        onChange={handleSelectDate}
        placeholder="Select Date"
      />
      <SignalSelectorModal availableSignals={availableSignals} setSelectedSignals={setSelectedSignals} />

      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.hoursContainer}>
        {availableHours.map((hour) => (
          <TouchableOpacity key={hour} style={styles.hourButton} onPress={() => showOrHidePointer(hour)}>
            <Text style={styles.hourText}>{`${hour.toString().padStart(2, "0")}:00`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* negativeConsumption: "Vuelco a red eléctrica",
        positiveConsumption: "Consumo de red máxima",
        productionCleanVat: "Producción fotovoltaica",
        totalConsumption: "Consumo */}
      {parsedData.length > 0 && (
        <LineChart
          dataSet={parsedData}
          color="#10B981"
          scrollRef={scrollRef}
          xAxisLabelTextStyle={{ width: 50, color: "#DBFFE8" }}
          hideDataPoints
          height={220}
          yAxisTextStyle={{
            color: "#DBFFE8",
          }}
          backgroundColor="#083344"
          curvature={0.09}
          curved
          dashWidth={20}
          dashGap={10}
        />
      )}
    </ScrollView>
  );
});

export default PropertyGraph;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: "#0F242A",
  },
  dropdown: {
    height: 50,
    borderColor: "#DBFFE8",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: "#DBFFE8",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#DBFFE8",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#DBFFE8",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  hoursContainer: {
    marginBottom: 16,
    flex: 1,
    minHeight: 40,
  },
  hourButton: {
    padding: 6,
    margin: 4,
    backgroundColor: "#164E63",
    borderRadius: 8,
  },
  hourText: {
    color: "#DBFFE8",
  },
});
