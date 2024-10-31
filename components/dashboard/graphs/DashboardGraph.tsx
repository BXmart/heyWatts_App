import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import useDashboard from '@/hooks/useDashboardHook';
import { BarColors, GraphType } from '../utils/parseDashboardData';
import Octicons from '@expo/vector-icons/Octicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import EnergyMoneyResume from './components/EnergyMoneyResume';
import { EnergyDayPriceI, OwnerDashboardI } from '@/types/OwnerDashboard';
import MarketPriceGraphs from './MarketGraph';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { Colors } from '../utils/circularTimeRangeUtils';

const { width } = Dimensions.get('window');

const DashboardGraph = React.memo(
  ({ dashboardData, initialData, currentProperty, marketPrices }: { dashboardData: OwnerDashboardI; initialData: EnergyDayPriceI[]; currentProperty: string | null; marketPrices: any }) => {
    const { graphType, parsedEnergyData, parsedEnergyPredictionData, parsedMoneyData, originalEnergyData, originalMoneyData, loading, setGraphType, setCurrentDate, currentDate, setPropertyId } =
      useDashboard();
    const [isPointerShown, setIsPointerShown] = useState(false);
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
        return currentDateObj.toISOString().split('T')[0];
      });
    }, [setCurrentDate]);

    const handleNextDay = useCallback(() => {
      setCurrentDate((prev) => {
        const currentDateObj = new Date(prev);
        currentDateObj.setDate(currentDateObj.getDate() + 1);
        return currentDateObj.toISOString().split('T')[0];
      });
    }, [setCurrentDate]);

    const maxValue = Math.max(...currentData.map((item) => item.value), ...(graphType === GraphType.Energy ? parsedEnergyPredictionData.map((item) => item.value) : []));

    const minValue = Math.min(...currentData.map((item) => item.value), ...parsedEnergyPredictionData.map((item) => item.value));

    const renderTooltip = (item: any) => {
      return (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{`${item.label}:00`}</Text>
          <Text style={styles.tooltipText}>
            {item.frontColor === '#4bbc96' ? (graphType == GraphType.Money ? 'Importe Volcado:' : 'Energía Volcada:') : graphType == GraphType.Money ? 'Importe Consumido:' : 'Energía Consumida:'}
            <Text style={styles.boldText}>
              {item.value.toFixed(3)}
              {graphType == GraphType.Money ? '€/' : ''}kWh
            </Text>
          </Text>
          {/* <Text style={styles.tooltipText}>
            Predicción de consumo: <Text style={styles.boldText}>{item.value.toFixed(3)}€/kWh</Text>
          </Text> */}
        </View>
      );
    };

    const Legend = ({ graphType }: { graphType: number }) => (
      <View style={styles.legendContainer}>
        {graphType == GraphType.Energy && (
          <>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: BarColors.red }]} />
              <View style={[styles.legendColor, { backgroundColor: BarColors.orange }]} />
              <View style={[styles.legendColor, { backgroundColor: BarColors.green }]} />
              <Text style={styles.legendText}>Actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F29C6E' }]} />
              <Text style={styles.legendText}>Predicción</Text>
            </View>
          </>
        )}
        {graphType == GraphType.Money && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.MODERATE }]} />
            <Text style={styles.legendText}>Consumida</Text>
            <View style={[styles.legendColor, { backgroundColor: Colors.SURPLUS_COMPENSATION_MODERATE }]} />
            <Text style={styles.legendText}>Volcada</Text>
          </View>
        )}
      </View>
    );

    if (!initialData) {
      return <Text>Waiting for data...</Text>;
    }

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Energía diaria</Text>
            <View style={styles.segmentedControl}>
              {['€', 'kWh'].map((value, index) => (
                <TouchableOpacity key={index} style={[styles.segment, graphType === index && styles.selectedSegment]} onPress={() => setGraphType(index)}>
                  <Text style={[styles.segmentText, graphType === index && styles.selectedSegmentText]}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={'#164E63'} />
            </View>
          ) : (
            <>
              <BarChart
                maxValue={maxValue}
                data={[
                  ...(currentData || initialData),
                  {
                    value: graphType == GraphType.Energy ? minValue : 0,
                    label: '',
                    frontColor: 'transparent',
                  },
                ]}
                width={width - 100}
                height={200}
                barWidth={22}
                barBorderRadius={5}
                xAxisIndicesWidth={1}
                yAxisColor={'white'}
                yAxisThickness={1}
                xAxisThickness={1}
                xAxisLabelTextStyle={{ color: 'gray' }}
                yAxisLabelWidth={20}
                dashWidth={20}
                dashGap={10}
                lineBehindBars
                renderTooltip={renderTooltip}
                showGradient={graphType == GraphType.Money}
                noOfSections={graphType == GraphType.Money ? 2 : 4}
                autoCenterTooltip
                yAxisTextStyle={{
                  color: 'gray',
                  fontSize: 11,
                  marginRight: 0,
                  paddingLeft: 0,
                }}
                showLine={graphType === GraphType.Energy}
                lineConfig={{
                  color: '#F29C6E',
                  thickness: 3,
                  dataPointsColor: '#F29C6E',
                  dataPointsRadius: 5,
                }}
                lineData={parsedEnergyPredictionData}
              />
              <Legend graphType={graphType} />
            </>
          )}
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={handlePreviousDay}>
              <View style={styles.navButtonLeft}>
                <Octicons name="chevron-left" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <Text style={styles.date}>Día: {currentDate}</Text>
            <TouchableOpacity onPress={handleNextDay} disabled={graphType == GraphType.Money ? new Date(currentDate) >= TODAY : false} activeOpacity={0}>
              <View style={styles.navButtonRight}>
                <Octicons name="chevron-right" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          {dashboardData && originalEnergyData && <EnergyMoneyResume data={dashboardData} dateData={originalEnergyData} currentGraphMode={graphType} showPredictions={true} hasInverter={true} />}
        </Card>

        {marketPrices && <MarketPriceGraphs data={dashboardData} energyPrice={marketPrices} energyCompPrice={marketPrices.energyCompPrice} currentDate={currentDate} setCurrentDate={setCurrentDate} />}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'transparent',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 5,
  },
  title: {
    fontSize: 20,
    color: 'lightgray',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 15,
    color: 'lightgray',
    fontWeight: 'bold',
  },
  segmentedControl: {
    marginLeft: 'auto',
    flexDirection: 'row',
    backgroundColor: '#164E63',
    borderRadius: 15,
    padding: 4,
    maxWidth: 98,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSegment: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 16,
    color: '#666666',
  },
  selectedSegmentText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    backgroundColor: 'transparent',
  },
  navButtonLeft: {
    backgroundColor: 'lightgray',
    borderRadius: 70,
    paddingRight: 13,
    paddingLeft: 11,
    paddingVertical: 4,
    textAlign: 'center',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  navButtonRight: {
    backgroundColor: 'lightgray',
    borderRadius: 100,
    paddingRight: 11,
    paddingLeft: 13,
    paddingVertical: 4,
    textAlign: 'center',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
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
    top: 100,
  },
  tooltipText: {
    fontSize: 12,
    color: '#64748B',
  },
  boldText: {
    fontWeight: 'bold',
  },
  yAxisTextStyle: {
    color: 'gray',
    fontSize: 11,
    marginRight: 0,
    paddingLeft: 0,
  },
  xAxisLabelTextStyle: {
    color: 'gray',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default DashboardGraph;
