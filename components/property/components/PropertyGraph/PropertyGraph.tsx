import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDayHistoricGraph } from '@/hooks/property/useDayHistoricGraph';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Feather from '@expo/vector-icons/Feather';
import * as ScreenOrientation from 'expo-screen-orientation';
import { parseData } from '@/components/dashboard/utils/parsePropertyGraphData';
import SignalSelector from '../SignalSelector.component';
import CustomAreaChart from '@/components/common/CustomAreaChart/CustomAreaChart.component';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LineColors = ['#00FF00', '#00BFFF', '#FF00FF', '#FFFF00', '#FFA500', '#00FFFF', '#FFB6C1', '#32CD32', '#8A2BE2', '#FF0000'];

interface AreaChartData {
  id: string;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  data: Array<{
    value: number;
    label: string;
    timestamp: number;
  }>;
}

const PropertyGraph = React.memo(() => {
  const { data, isLoading, selectedDay, setSelectedDay } = useDayHistoricGraph();
  const [availableSignals, setAvailableSignals] = useState<any>();
  const [selectedSignals, setSelectedSignals] = useState(['totalConsumption']);
  const [parsedData, setParsedData] = useState<AreaChartData[]>([]);
  const [time, setTime] = useState(new Date());

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const isLandscape = WINDOW_WIDTH > WINDOW_HEIGHT;

  useEffect(() => {
    if (data?.historicDevices) {
      const signals = data.historicDevices.map((device: any) => ({
        label: device.name,
        value: device.name,
        id: device.name,
      }));

      const allSignals = [
        { label: 'Vuelco a red eléctrica', value: 'negativeConsumption', id: 'negativeConsumption' },
        { label: 'Consumo de red eléctrica', value: 'positiveConsumption', id: 'positiveConsumption' },
        { label: 'Producción fotovoltaica', value: 'productionCleanVat', id: 'productionCleanVat' },
        { label: 'Consumo total', value: 'totalConsumption', id: 'totalConsumption' },
        ...signals,
      ];
      setAvailableSignals(allSignals);
    }
  }, [data]);

  const transformData = useCallback((rawData: any[], type: string, label: string, colorIndex: number): AreaChartData | null => {
    if (!rawData?.length) return null;

    return {
      id: type,
      label: label,
      color: LineColors[colorIndex],
      gradientFrom: LineColors[colorIndex],
      gradientTo: `${LineColors[colorIndex]}00`,
      data: rawData
        .filter((point) => point.label && point.value !== undefined)
        .map((point) => ({
          value: Number(point.value) || 0,
          label: point.label,
          timestamp: new Date(`2000-01-01T${point.label}:00`).getTime(),
        }))
        .filter((point) => !isNaN(point.timestamp)),
    };
  }, []);

  useEffect(() => {
    if (data && selectedSignals && availableSignals) {
      try {
        const auxData = parseData(data, selectedSignals);
        const transformedData: AreaChartData[] = [];

        const dataTypes = [
          { data: auxData.positiveConsumption, type: 'positiveConsumption', label: 'Consumo de red eléctrica' },
          { data: auxData.negativeConsumption, type: 'negativeConsumption', label: 'Vuelco a red eléctrica' },
          { data: auxData.productionCleanVat, type: 'productionCleanVat', label: 'Producción fotovoltaica' },
          { data: auxData.totalConsumption, type: 'totalConsumption', label: 'Consumo total' },
        ];

        dataTypes.forEach(({ data: dataset, type, label }) => {
          if (dataset?.length) {
            const index = availableSignals.findIndex((signal: any) => signal.value === type);
            const transformed = transformData(dataset, type, label, index);
            if (transformed) transformedData.push(transformed);
          }
        });

        if (auxData.historicDevices) {
          Object.entries(auxData.historicDevices).forEach(([key, dataset]) => {
            const index = availableSignals.findIndex((signal: any) => signal.value === key);
            const transformed = transformData(dataset, key, key, index);
            if (transformed) transformedData.push(transformed);
          });
        }

        setParsedData(transformedData);
      } catch (error) {
        console.error('Error transforming data:', error);
        setParsedData([]);
      }
    }
  }, [data, selectedSignals, availableSignals, transformData]);

  const renderGraph = (isLandscape = false) => {
    if (parsedData.length === 0) return null;

    return (
      <View style={styles.graphWrapper}>
        <CustomAreaChart data={parsedData} showGrid={true} showLabels={true} backgroundColor="#083344" paddingHorizontal={20} paddingVertical={20} />
      </View>
    );
  };

  const onChange = (event: any, selectedValue: any) => {
    const currentDate = selectedValue || new Date();
    setSelectedDay(currentDate);
  };

  const onChangeTime = (event: any, selectedValue: any) => {
    const selectedTime = selectedValue || new Date();
    setTime(selectedTime);
  };

  const openDatePickHandler = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'date',
        value: selectedDay,
        onChange: (_, newDate) => {
          if (newDate) setSelectedDay(newDate);
        },
      });
    } else {
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
                <TouchableOpacity onPress={openDatePickHandler}>
                  <Text style={styles.title}>{selectedDay.toLocaleString()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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

      {Platform.OS !== 'android' && (
        <>
          {<DateTimePicker testID="datePicker" value={selectedDay} mode="date" display="default" themeVariant="dark" onChange={onChange} />}
          {<DateTimePicker testID="timePicker" value={time} mode="time" display="default" themeVariant="dark" onChange={onChangeTime} />}
        </>
      )}
    </View>
  );
});

export default PropertyGraph;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#164E63',
    padding: 10,
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F242A',
  },
  landscapeContainer: {
    padding: 0, // Remove padding in landscape mode
  },
  fixedSection: {
    backgroundColor: '#0F242A',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  fullWidthContainer: {
    marginLeft: -16, // Negative margin to counter parent padding
    marginRight: -16,
    backgroundColor: '#0F242A',
  },

  graphWrapper: {
    width: SCREEN_WIDTH, // Force full screen width
    maxHeight: 300,
    overflow: 'hidden', // Prevent content from spilling out
    backgroundColor: '#083344',
    borderRadius: 15,
  },

  graphContainer: {
    backgroundColor: '#0F242A',
  },

  landscapeGraphContainer: {
    flex: 1,
    backgroundColor: '#0F242A',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Force full width in landscape
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickersContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 16,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#164E63',
  },
  scrollSection: {
    flex: 1,
    backgroundColor: '#0F242A',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  signalContainer: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: '#DBFFE8',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#DBFFE8',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#DBFFE8',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#DBFFE8',
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
    backgroundColor: '#164E63',
    borderRadius: 8,
  },
  hourText: {
    color: '#DBFFE8',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -5,
  },
});
