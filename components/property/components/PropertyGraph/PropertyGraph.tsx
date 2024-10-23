import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { useDayHistoricGraph } from "@/hooks/property/useDayHistoricGraph";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import * as ScreenOrientation from "expo-screen-orientation";
import { parseData } from "@/components/dashboard/utils/parsePropertyGraphData";
import SignalSelector from "../SignalSelector.component";

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
  const [time, setTime] = useState(new Date());
  const [isCompressed, setIsCompressed] = useState(false);

  // Use window dimensions hook for dynamic width/height
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();

  // Calculate if we're in landscape mode
  const isLandscape = WINDOW_WIDTH > WINDOW_HEIGHT;

  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  };

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

  const showOrHidePointer = (time: Date) => {
    if (scrollRef.current) {
      scrollRef.current!.scrollTo({
        x: time.getHours() * 3000 + time.getMinutes() * 50,
        animated: true,
      });
    }
  };

  const compressData = (data) => {
    if (!data || data.length === 0) return [];

    // If we're not compressing, return original data
    if (!isCompressed) return data;

    // First, filter to get only hourly points and sort them
    const hourlyData = data
      .filter((point) => {
        const timeMatch = point.label.match(/(\d{2}):(\d{2})/);
        if (!timeMatch) return false;
        const minutes = parseInt(timeMatch[2]);
        return minutes === 0;
      })
      .sort((a, b) => {
        const hourA = parseInt(a.label.match(/(\d{2}):/)[1]);
        const hourB = parseInt(b.label.match(/(\d{2}):/)[1]);
        return hourA - hourB;
      });

    if (hourlyData.length === 0) return [];

    // Determine if we're looking at today's data
    const today = new Date();
    const selectedDate = selectedDay || today;
    const isToday = selectedDate.toDateString() === today.toDateString();

    // Get start and end hours
    const startHour = 0;
    const endHour = isToday ? today.getHours() : 23;

    // Find the start and end points
    const startPoint = hourlyData.find((point) => {
      const hour = parseInt(point.label.match(/(\d{2}):/)[1]);
      return hour === startHour;
    });

    const endPoint = hourlyData.find((point) => {
      const hour = parseInt(point.label.match(/(\d{2}):/)[1]);
      return hour === endHour;
    });

    // If we don't have both start and end points, return original filtered data
    if (!startPoint || !endPoint) return hourlyData;

    // We want maximum 8 points including start and end
    const maxPoints = 8;

    if (hourlyData.length <= maxPoints) {
      return hourlyData;
    }

    // Always include start and end points
    const result = [startPoint];

    // Calculate how many intermediate points we need
    const intermediatePointsNeeded = maxPoints - 2;

    // Get all points between start and end
    const intermediatePoints = hourlyData.filter((point) => {
      const hour = parseInt(point.label.match(/(\d{2}):/)[1]);
      return hour > startHour && hour < endHour;
    });

    // Select intermediate points
    if (intermediatePoints.length > 0) {
      const step = Math.ceil(intermediatePoints.length / intermediatePointsNeeded);

      for (let i = 0; i < intermediatePoints.length; i += step) {
        if (result.length < maxPoints - 1) {
          // -1 to leave room for end point
          result.push(intermediatePoints[i]);
        }
      }
    }

    // Add the end point
    result.push(endPoint);

    return result;
  };

  const processDataForDisplay = useCallback(() => {
    if (!data || !selectedSignals) return [];

    const auxData = parseData(data, selectedSignals);
    let dataArray = [];

    // Process each data type
    if (auxData.positiveConsumption.length > 0) {
      const index = availableSignals?.findIndex((signal) => signal.value === "positiveConsumption") ?? 0;
      dataArray.push({
        data: compressData(auxData.positiveConsumption),
        color: LineColors[index],
        label: "Consumo de red electromotriz",
        value: "positiveConsumption",
      });
    }

    if (auxData.negativeConsumption.length > 0) {
      const index = availableSignals?.findIndex((signal) => signal.value === "negativeConsumption") ?? 1;
      dataArray.push({
        data: compressData(auxData.negativeConsumption),
        color: LineColors[index],
        label: "Vuelco a red eléctrica",
        value: "negativeConsumption",
      });
    }

    if (auxData.productionCleanVat.length > 0) {
      const index = availableSignals?.findIndex((signal) => signal.value === "productionCleanVat") ?? 2;
      dataArray.push({
        data: compressData(auxData.productionCleanVat),
        color: LineColors[index],
        label: "Producción fotovoltaica",
        value: "productionCleanVat",
      });
    }

    if (auxData.totalConsumption.length > 0) {
      const index = availableSignals?.findIndex((signal) => signal.value === "totalConsumption") ?? 3;
      dataArray.push({
        data: compressData(auxData.totalConsumption),
        color: LineColors[index],
        label: "Consumo total",
        value: "totalConsumption",
      });
    }

    if (auxData.historicDevices) {
      const deviceData = Object.keys(auxData.historicDevices).map((key) => {
        const index = availableSignals?.findIndex((signal) => signal.value === key) ?? 0;
        return {
          data: compressData(auxData.historicDevices[key]),
          color: LineColors[index],
          label: key,
          value: key,
        };
      });
      dataArray.push(...deviceData);
    }

    return dataArray;
  }, [data, selectedSignals, isCompressed, availableSignals]);

  useEffect(() => {
    const processedData = processDataForDisplay();
    setParsedData(processedData);
  }, [data, selectedSignals, isCompressed]);

  function renderGraph(isLandscape = false) {
    if (parsedData.length === 0) return null;

    const graphWidth = isLandscape ? WINDOW_WIDTH : isCompressed ? WINDOW_WIDTH : WINDOW_WIDTH * 3;

    const graphHeight = isLandscape ? WINDOW_HEIGHT : WINDOW_HEIGHT * 0.4; // Adjust this value as needed for portrait mode

    return (
      <View style={styles.graphWrapper}>
        <LineChart
          key={`${JSON.stringify(parsedData)}-${isCompressed}-${isLandscape}`}
          dataSet={parsedData}
          scrollRef={!isCompressed ? scrollRef : undefined}
          height={graphHeight / 1.5}
          width={graphWidth} // Explicitly set width
          thickness={2}
          xAxisColor="#DBFFE8"
          yAxisColor="#DBFFE8"
          yAxisTextStyle={{ color: "#DBFFE8" }}
          xAxisLabelTextStyle={{ color: "#DBFFE8" }}
          yAxisThickness={2}
          xAxisThickness={2}
          /* dataPointsColor="#DBFFE8" */
          hideRules
          hideDataPoints
          curved
          pointerConfig={{
            activatePointersOnLongPress: true,
            pointerStripUptoDataPoint: true,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: "lightgray",
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 120,
                    width: 200,
                    backgroundColor: "#282C3E",
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingLeft: 16,
                    marginTop: -30,
                    marginLeft: -40,
                  }}
                >
                  {items.map((item, index) => (
                    <View style={{ flexDirection: "column" }} key={index}>
                      <Text style={{ color: "lightgray", fontSize: 12 }}>{item.type}</Text>
                      <Text style={{ color: "white", fontWeight: "bold" }}>{item.value.toFixed(2)} kWh</Text>
                    </View>
                  ))}
                </View>
              );
            },
          }}
        />
      </View>
    );
  }
  const [mode, setMode] = useState("date");
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChange = (event: any, selectedValue: any) => {
    const currentDate = selectedValue || new Date();
    setSelectedDay(currentDate);
  };

  const onChangeTime = (event: any, selectedValue: any) => {
    const selectedTime = selectedValue || new Date();
    showOrHidePointer(selectedTime);
    setTime(selectedTime);
  };

  const openDatePickHandler: VoidFunction = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: selectedDay,
        onChange: (event, newDate) => {
          setSelectedDay(newDate);
        },
      });
    } else {
      DateTimePicker.show({
        mode: "date",
        date: selectedDay,
        onChange: (event, newDate) => {
          if (newDate) setSelectedDay(newDate);
        },
      });
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#164E63" />;

  return (
    <View style={[styles.mainContainer, isLandscape && styles.landscapeContainer]}>
      {!isLandscape ? (
        <>
          <View style={styles.fixedSection}>
            <View style={styles.headerRow}>
              <View style={styles.datePickersContainer}>
                {Platform.OS === "android" && (
                  <>
                    <TouchableOpacity onPress={openDatePickHandler}>
                      <Text style={styles.title}>{selectedDay.toLocaleString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTime(true)}>
                      <Text style={styles.title}>{time.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {Platform.OS !== "android" && (
                  <>
                    {showDate && <DateTimePicker testID="datePicker" value={selectedDay ?? new Date()} mode="date" display="default" themeVariant="dark" onChange={onChange} />}
                    {showTime && <DateTimePicker testID="timePicker" value={time ?? new Date()} mode="time" display="default" themeVariant="dark" onChange={onChangeTime} />}
                  </>
                )}
              </View>
              <TouchableOpacity style={styles.viewToggle} onPress={() => setIsCompressed(!isCompressed)}>
                {isCompressed ? <Feather name="maximize-2" size={24} color="black" /> : <Feather name="minimize-2" size={24} color="black" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Graph container moved outside of fixedSection */}
          <View style={styles.fullWidthContainer}>{renderGraph()}</View>

          <ScrollView style={styles.scrollSection} contentContainerStyle={styles.scrollContent}>
            <View style={styles.signalContainer}>
              {availableSignals && <SignalSelector availableSignals={availableSignals} setSelectedSignals={setSelectedSignals} selectedSignals={selectedSignals} lineColors={LineColors} />}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.landscapeGraphContainer}>{renderGraph(true)}</View>
      )}
    </View>
  );
});

export default PropertyGraph;

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#164E63",
    padding: 10,
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#0F242A",
  },
  landscapeContainer: {
    padding: 0, // Remove padding in landscape mode
  },
  fixedSection: {
    backgroundColor: "#0F242A",
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  fullWidthContainer: {
    marginLeft: -16, // Negative margin to counter parent padding
    marginRight: -16,
    backgroundColor: "#0F242A",
  },

  graphWrapper: {
    width: SCREEN_WIDTH, // Force full screen width
    maxHeight: 300,
    overflow: "hidden", // Prevent content from spilling out
    backgroundColor: "#083344",
    borderRadius: 15,
  },

  graphContainer: {
    backgroundColor: "#0F242A",
  },

  landscapeGraphContainer: {
    flex: 1,
    backgroundColor: "#0F242A",
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Force full width in landscape
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  datePickersContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginRight: 16,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#164E63",
  },
  scrollSection: {
    flex: 1,
    backgroundColor: "#0F242A",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  signalContainer: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
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
