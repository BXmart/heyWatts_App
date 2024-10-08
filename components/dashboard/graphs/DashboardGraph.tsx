import React, { useCallback, useEffect, useMemo } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Card } from "@/components/ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import useDashboard from "@/hooks/useDashboardHook";
import { GraphType } from "../utils/parseDashboardData";
import useAuthStore from "@/stores/useAuthStore";
import Octicons from "@expo/vector-icons/Octicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { ActivityIndicator } from "react-native-paper";
import Colors from "@/utils/Colors";
import { analyzeCompPrices, analyzeEnergyPrices } from "../utils/circularTimeRangeUtils";
import EnergyMoneyResume from "./components/EnergyMoneyResume";
import { EnergyDayPriceI, OwnerDashboardI } from "@/types/OwnerDashboard";

const { width } = Dimensions.get("window");

const DashboardGraph = React.memo(({ dashboardData, initialData, currentProperty }: { dashboardData: OwnerDashboardI; initialData: EnergyDayPriceI[]; currentProperty: string | undefined }) => {
  const { graphType, parsedEnergyData, parsedEnergyPredictionData, parsedMoneyData, originalEnergyData, originalMoneyData, loading, setGraphType, setCurrentDate, currentDate, setPropertyId } =
    useDashboard();

  const currentData = useMemo(() => (graphType === GraphType.Energy ? parsedEnergyData : parsedMoneyData), [graphType, parsedEnergyData, parsedMoneyData]);

  const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    if (currentProperty) {
      setPropertyId(currentProperty);
    }
  }, [currentProperty]);

  const handlePreviousDay = useCallback(() => {
    setCurrentDate((prev: string) => {
      const currentDateObj = new Date(prev);
      currentDateObj.setDate(currentDateObj.getDate() - 1);
      return currentDateObj.toISOString().split("T")[0];
    });
  }, [setCurrentDate]);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const currentDateObj = new Date(prev);
      currentDateObj.setDate(currentDateObj.getDate() + 1);
      return currentDateObj.toISOString().split("T")[0];
    });
  }, [setCurrentDate]);

  const maxValue = Math.max(...currentData.map((item) => item.value), ...(graphType === GraphType.Energy ? parsedEnergyPredictionData.map((item) => item.value) : []));

  const minValue = Math.min(...currentData.map((item) => item.value), ...parsedEnergyPredictionData.map((item) => item.value));

  const renderTooltip = (item: any) => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 40,
          marginLeft: -12,
          /* backgroundColor: "#164E63", */
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 4,
          color: "white",
        }}
      >
        <Text style={styles.tooltipText}>{`${item.label}:00`}</Text>
        <Text style={styles.tooltipText}>
          Precio de la luz: <Text style={styles.boldText}>{item.value.toFixed(3)}€/kWh</Text>
        </Text>
      </View>
    );
  };

  if (!initialData) {
    return <Text>Waiting for data...</Text>;
  }

  return (
    <Card>
      {graphType === GraphType.Energy && <Text>Gráfica de consumos</Text>}
      {graphType === GraphType.Money && <Text>Gráfica de euros</Text>}

      <Text>{currentDate}</Text>

      <SegmentedControl
        values={["Euros", "Energía"]}
        selectedIndex={graphType}
        onChange={(event) => {
          setGraphType(event.nativeEvent.selectedSegmentIndex);
        }}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={"#164E63"} />
        </View>
      ) : (
        <BarChart
          maxValue={maxValue}
          data={[
            ...(currentData || initialData),
            {
              value: graphType == GraphType.Energy ? minValue : 0,
              label: "",
              frontColor: "transparent",
            },
          ]}
          width={width - 100}
          height={200}
          barWidth={22}
          barBorderRadius={5}
          xAxisIndicesWidth={1}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ color: "gray" }}
          yAxisLabelWidth={20}
          isAnimated
          animationDuration={75}
          dashWidth={20}
          dashGap={10}
          lineBehindBars
          renderTooltip={renderTooltip}
          showGradient={graphType == GraphType.Money}
          noOfSections={graphType == GraphType.Money ? 2 : 4}
          yAxisTextStyle={{
            color: "gray",
            fontSize: 11,
            marginRight: 0,
            paddingLeft: 0,
          }}
          showLine={graphType === GraphType.Energy}
          lineConfig={{
            color: "#F29C6E",
            thickness: 3,
            curved: true,
            hideDataPoints: true,
          }}
          lineData={parsedEnergyPredictionData}
          /*  renderTooltip={(item: any, index: number) => {
            return (
              <View
                style={{
                  position: graphType == GraphType.Money ? "absolute" : "relative",
                  top: graphType == GraphType.Money ? 40 : 0,
                  marginLeft: -12,
                  backgroundColor: "#164E63",
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>{item.value}</Text>
              </View>
            );
          }} */
        />
      )}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <View style={styles.navButtonLeft}>
            <Octicons name="chevron-left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextDay} disabled={graphType == GraphType.Money ? new Date(currentDate) >= TODAY : false} activeOpacity={0}>
          <View style={styles.navButtonRight}>
            <Octicons name="chevron-right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {dashboardData && <EnergyMoneyResume data={dashboardData} dateData={graphType == GraphType.Money ? originalMoneyData : originalEnergyData} currentGraphMode={graphType} />}
    </Card>
  );
});

const styles = StyleSheet.create({
  navigationContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
  },
  navButtonLeft: {
    backgroundColor: "lightgray",
    borderRadius: 70,
    paddingRight: 13,
    paddingLeft: 11,
    paddingVertical: 4,
    textAlign: "center",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  navButtonRight: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    paddingRight: 11,
    paddingLeft: 13,
    paddingVertical: 4,
    textAlign: "center",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 12,
    color: "#64748B",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default DashboardGraph;
