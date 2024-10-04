import React, { useCallback, useEffect, useState } from "react";
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

const { width } = Dimensions.get("window");

const DashboardGraph: React.FC = () => {
  const { userInfo } = useAuthStore();
  const { graphType, parsedEnergyData, parsedEnergyPredictionData, parsedMoneyData, loading, initialDataLoaded, setGraphType, setCurrentDate, currentDate } = useDashboard();

  const currentData = graphType === GraphType.Energy ? parsedEnergyData : parsedMoneyData;

  const filterDataByDay = (data: any[]) => {
    return data.filter((item) => moment(item.date).isSame(currentDate, "day"));
  };

  const filteredCurrentData = filterDataByDay(currentData);
  const filteredPredictionData = filterDataByDay(parsedEnergyPredictionData);

  const handlePreviousDay = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    setCurrentDate(currentDateObj.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    setCurrentDate(currentDateObj.toISOString().split("T")[0]);
  };

  useEffect(() => {
    console.log({ loading });
  }, [loading]);

  const maxValue = Math.max(...filteredCurrentData.map((item) => item.value), ...(graphType === GraphType.Energy ? filteredPredictionData.map((item) => item.value) : []));
  const minValue = Math.min(...filteredCurrentData.map((item) => item.value), ...filteredPredictionData.map((item) => item.value));

  return (
    <Card>
      {loading ? <Text>Loading...dasd</Text> : initialDataLoaded ? <Text>Waiting</Text> : <DashboardGraph />}
      {graphType === GraphType.Energy && <Text>Gráfica de consumos</Text>}
      {graphType === GraphType.Money && <Text>Gráfica de euros</Text>}

      <Text>{currentDate}</Text>

      <SegmentedControl
        values={["Euros", "Energía"]}
        selectedIndex={graphType}
        onChange={(event) => {
          if (userInfo?.user.propertyByDefault?._id) {
            setGraphType(event.nativeEvent.selectedSegmentIndex);
          }
        }}
      />

      <BarChart
        maxValue={maxValue}
        data={[
          ...filteredCurrentData,
          {
            value: graphType == GraphType.Energy ? minValue : 0,
            label: "",
            frontColor: "transparent",
          },
        ]}
        width={width - 100}
        height={200}
        barWidth={22}
        showGradient={graphType == GraphType.Money}
        barBorderRadius={5}
        noOfSections={graphType == GraphType.Money ? 2 : 4}
        xAxisIndicesWidth={1}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: "gray" }}
        yAxisLabelWidth={20}
        isAnimated
        animationDuration={150}
        yAxisTextStyle={{
          color: "gray",
          fontSize: 11,
          marginRight: 0,
          paddingLeft: 0,
        }}
        dashWidth={20}
        dashGap={10}
        lineBehindBars
        showLine={graphType === GraphType.Energy}
        lineConfig={{
          color: "#F29C6E",
          thickness: 3,
          curved: true,
          hideDataPoints: true,
        }}
        lineData={filteredPredictionData}
        renderTooltip={(item: any, index: number) => {
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
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <TouchableOpacity onPress={handlePreviousDay}>
          <Octicons name="chevron-left" size={24} color="black" style={styles.navButtonLeft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextDay}>
          <Octicons name="chevron-right" size={24} color="black" style={styles.navButtonRight} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  navButtonLeft: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    paddingRight: 13,
    paddingLeft: 11,
    paddingVertical: 4,
    textAlign: "center",
  },
  navButtonRight: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    paddingRight: 11,
    paddingLeft: 13,
    paddingVertical: 4,
    textAlign: "center",
  },
});

export default DashboardGraph;
