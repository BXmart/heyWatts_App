import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { useDayHistoricGraph } from "@/hooks/property/useDayHistoricGraph";
import { parseData } from "../../dashboard/utils/parsePropertyGraphData";
import SignalSelector from "./SignalSelector.component";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_PADDING = 32;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;

export const LineColors = ["#00FF00", "#00BFFF", "#FF00FF", "#FFFF00", "#FFA500", "#00FFFF", "#FFB6C1", "#32CD32", "#8A2BE2", "#FF0000"];
enum DataTypes {
  negativeConsumption = "Vuelco a red eléctrica",
  positiveConsumption = "Consumo de red eléctrica",
  productionCleanVat = "Producción fotovoltaica",
  totalConsumption = "Consumo total",
}
const PropertyGraph = React.memo(() => {
  const { data, isLoading, availableDates, selectedDay, setSelectedDay, availableHours } = useDayHistoricGraph();
  const [availableSignals, setAvailableSignals] = useState<any>();
  const [selectedSignals, setSelectedSignals] = useState(["totalConsumption"]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const scrollRef = useRef(null);
  const [time, setTime] = useState();

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
      const auxData = parseData(data, selectedSignals);
      let dataArray = [];
      if (auxData.positiveConsumption.length > 0) {
        const index = availableSignals.findIndex((signal: any) => signal.value === "positiveConsumption");

        dataArray.push({ data: auxData.positiveConsumption, color: LineColors[index], label: "Consumo de red electromotriz", value: "positiveConsumption" });
      } else {
        dataArray.push({ data: [] });
      }

      if (auxData.negativeConsumption.length > 0) {
        const index = availableSignals.findIndex((signal: any) => signal.value === "negativeConsumption");
        dataArray.push({ data: auxData.negativeConsumption, color: LineColors[index], label: "Vuelco a red eléctrica", value: "negativeConsumption" });
      } else {
        dataArray.push({ data: [] });
      }

      if (auxData.productionCleanVat.length > 0) {
        const index = availableSignals.findIndex((signal: any) => signal.value === "productionCleanVat");
        dataArray.push({ data: auxData.productionCleanVat, color: LineColors[index], label: "Producción fotovoltaica", value: "productionCleanVat" });
      } else {
        dataArray.push({ data: [] });
      }

      if (auxData.totalConsumption.length > 0) {
        const index = availableSignals.findIndex((signal: any) => signal.value === "totalConsumption");
        dataArray.push({ data: auxData.totalConsumption, color: LineColors[index], label: "Consumo total", value: "totalConsumption" });
      } else {
        dataArray.push({ data: [] });
      }

      if (auxData.historicDevices) {
        dataArray.push(
          ...Object.keys(auxData.historicDevices).map((key) => {
            const index = availableSignals.findIndex((signal: any) => signal.value === key);
            return { data: auxData.historicDevices[key], color: LineColors[index], label: key, value: key };
          })
        );
      } else {
        dataArray.push({ data: [] });
      }
      setParsedData([...dataArray]);
    }
  }, [data, selectedSignals]);

  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate;
    setSelectedDay(currentDate);
  };

  const onChangeTime = (event: any, selectedTime: any) => {
    showOrHidePointer(selectedTime);
    setTime(selectedTime);
  };

  const showOrHidePointer = (time: Date) => {
    if (scrollRef.current) {
      scrollRef.current!.scrollTo({
        x: time.getHours() * 3000 + time.getMinutes() * 50,
        animated: true,
      });
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#164E63" />;

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <DateTimePicker testID="datePicker" value={selectedDay ?? new Date()} mode="date" display="default" themeVariant="dark" onChange={onChange} />
        <DateTimePicker testID="timePicker" value={time ?? new Date()} mode="time" display="default" themeVariant="dark" onChange={onChangeTime} />
      </View>
      <View style={styles.graphContainer}>
        {parsedData.length > 0 && (
          <LineChart
            key={JSON.stringify(parsedData)}
            dataSet={parsedData}
            scrollRef={scrollRef}
            thickness={2}
            xAxisColor="#DBFFE8"
            yAxisColor="#DBFFE8"
            yAxisTextStyle={{ color: "#DBFFE8" }}
            xAxisLabelTextStyle={{ color: "#DBFFE8" }}
            /*  rulesType="solid"
            rulesColor="gray" */
            yAxisThickness={2}
            xAxisThickness={2}
            dataPointsColor="#DBFFE8"
            hideRules
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: "lightgray",
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              pointerColor: "lightgray",
              radius: 4,
              pointerLabelWidth: 100,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items) => {
                console.log({ items });

                return (
                  <View
                    style={{
                      height: 120,
                      width: 100,
                      backgroundColor: "#282C3E",
                      borderRadius: 4,
                      justifyContent: "center",
                      paddingLeft: 16,
                    }}
                  >
                    {items.map((item) => (
                      <View style={{ flexDirection: "column" }} key={item}>
                        <Text style={{ color: "lightgray", fontSize: 12 }}>{item.type}</Text>
                        <Text style={{ color: "white", fontWeight: "bold" }}>{items.value} kWh</Text>
                      </View>
                    ))}
                  </View>
                );
              },
            }}
          />
        )}

        {isLoading && <ActivityIndicator size="large" color="#164E63" style={{ position: "absolute", top: "50%", left: "50%" }} />}
      </View>

      {availableSignals && <SignalSelector availableSignals={availableSignals} setSelectedSignals={setSelectedSignals} selectedSignals={selectedSignals} lineColors={LineColors} />}
    </ScrollView>
  );
});

export default PropertyGraph;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: "#0F242A",
    position: "relative",
  },
  graphContainer: {
    flexDirection: "column",
    backgroundColor: "#0F242A",
    position: "relative",
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
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -5,
  },
});
