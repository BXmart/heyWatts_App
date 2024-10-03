import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Card } from "@/components/ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Button from "@/components/ui/Button";
import useAuthStore from "@/stores/useAuthStore";
import parseDashboardData, {
  DashboardData,
  GraphType,
} from "../utils/parseDashboardData";

const DashboardGraph = ({ data }: { data: any }) => {
  const { logout } = useAuthStore();
  const [graphType, setGraphType] = useState<GraphType>(GraphType.Consumption);
  const [chartKey, setChartKey] = useState(0);
  const objectData: DashboardData = {
    consumptionData: data?.consumptionData,
    predictionData: data?.predictionData,
    predictedEuros: data?.predictedEuros,
  };
  const parsedData = parseDashboardData(objectData, graphType);
  console.log({ parsedData });
  /*   if (!data) {
    return <Text>Loading</Text>;
  }
 */
  return (
    <Card>
      {graphType == GraphType.Consumption && <Text>Gráfica de consumos</Text>}

      {graphType == GraphType.Prediction && (
        <Text>Gráfica de predicciones</Text>
      )}

      {graphType == GraphType.Money && <Text>Gráfica de euros</Text>}

      <BarChart
        key={chartKey}
        data={parsedData}
        width={300}
        height={300}
        barWidth={22}
        spacing={24}
        barBorderRadius={5}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: "gray" }}
        yAxisTextStyle={{ color: "gray" }}
        dashWidth={20}
        dashGap={10}
        lineBehindBars
        lineConfig={{
          color: "#F29C6E",
          thickness: 3,
          curved: true,
          hideDataPoints: true,
          shiftY: 20,
          initialSpacing: 30,
        }}
      />

      <SegmentedControl
        values={["Consumo", "Predicción", "Euros"]}
        selectedIndex={
          graphType === GraphType.Consumption
            ? 0
            : graphType === GraphType.Prediction
            ? 1
            : 2
        }
        onChange={(event) => {
          setGraphType(event.nativeEvent.selectedSegmentIndex);
          /*  setChartKey(chartKey + 1); */
        }}
      />

      <Button
        title="Cerrar sesión"
        onPress={() => {
          logout();
        }}
      />
    </Card>
  );
};

export default DashboardGraph;
