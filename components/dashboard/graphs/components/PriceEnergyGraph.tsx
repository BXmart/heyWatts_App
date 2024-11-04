import { EnergyDayPriceI } from '@/types/OwnerDashboard';
import React, { useEffect, useState, memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface PriceEnergyGraphProps {
  data: EnergyDayPriceI[];
}

const { width } = Dimensions.get('window');

const PriceEnergyGraph: React.FC<PriceEnergyGraphProps> = memo(({ data }) => {
  const [parsedData, setParsedData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const sortedData = data
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
        .map((item) => ({
          value: parseFloat(item.price.toFixed(2)),
          label: new Date(item.datetime).getHours().toString(),
          frontColor: item.tip ? '#ef4444' : item.flat ? '#fb923c' : item.valley ? '#22C55E' : '#94a3b8',
          topLabelComponent: () => <Text style={styles.topLabel}>{item.price.toFixed(3)}</Text>,
        }));
      setParsedData(sortedData);
    }
  }, [data]);

  const renderTooltip = (item: any) => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          marginLeft: -12,
          backgroundColor: '#164E63',
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Text style={styles.tooltipText}>{`${item.label}:00`}</Text>
        <Text style={styles.tooltipText}>
          Precio de la luz: <Text style={styles.boldText}>{item.value.toFixed(3)}€/kWh</Text>
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
        barWidth={12}
        spacing={2}
        barBorderRadius={5}
        xAxisIndicesWidth={1}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: 'gray', width: 50, transform: 'rotate(45deg)', fontSize: 10 }}
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
        autoCenterTooltip
        renderTooltip={renderTooltip}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  topLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 4,
  },
  yAxisText: {
    color: '#64748B',
    fontSize: 10,
  },
  tooltip: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    shadowColor: '#000',
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
    color: '#64748B',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default PriceEnergyGraph;
