import { EnergyDayPriceI } from "@/types/OwnerDashboard";
import React, { useEffect, useState, memo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface ExcessCompensationGraphProps {
  data: EnergyDayPriceI[];
}

const { width } = Dimensions.get("window");

const ExcessCompensationGraph: React.FC<ExcessCompensationGraphProps> = memo(({ data }) => {
  const [parsedData, setParsedData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const sortedData = data
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
        .map((item) => ({
          value: parseFloat((item.price * 10).toFixed(2)),
          label: new Date(item.datetime).getHours().toString(),
          frontColor: "#4e798a",
          topLabelComponent: () => <Text style={styles.topLabel}>{item.price.toFixed(3)}</Text>,
        }));
      setParsedData(sortedData);
    }
  }, [data]);

  const renderTooltip = (item: any) => {
    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{`${item.label}:00`}</Text>
        <Text style={styles.tooltipText}>
          Precio de compensación: <Text style={styles.boldText}>{item.value.toFixed(3)}€/kWh</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={parsedData}
        width={width - 100}
        height={200}
        barWidth={10}
        spacing={2}
        barBorderRadius={5}
        xAxisIndicesWidth={1}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: "gray", whiteSpace: "nowrap", width: 16 }}
        yAxisLabelWidth={20}
        isAnimated
        animationDuration={75}
        dashWidth={20}
        dashGap={10}
        lineBehindBars
        yAxisTextStyle={styles.yAxisText}
        noOfSections={5}
        maxValue={Math.max(...parsedData.map((item) => item.value))}
        yAxisLabelSuffix="€/kWh"
        renderTooltip={renderTooltip}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  topLabel: {
    fontSize: 8,
    color: "#64748B",
    marginBottom: 4,
  },
  yAxisText: {
    color: "#64748B",
    fontSize: 10,
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

export default ExcessCompensationGraph;