import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDayHistoricGraph } from '@/hooks/property/useDayHistoricGraph';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Feather from '@expo/vector-icons/Feather';
import * as ScreenOrientation from 'expo-screen-orientation';
import { parseData } from '@/components/dashboard/utils/parsePropertyGraphData';
import SignalSelector from '../SignalSelector.component';
import CustomAreaChart from '@/components/common/CustomAreaChart/CustomAreaChart.component';
import useAuthStore from '@/stores/useAuthStore';
import { getDayDevicesHistorical } from '@/services/historical.service';
import moment from 'moment';

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
  const { currentProperty } = useAuthStore();
  const { data, isLoading, selectedDay, setSelectedDay } = useDayHistoricGraph();
  const [availableSignals, setAvailableSignals] = useState<any>();
  const [selectedSignals, setSelectedSignals] = useState(['totalConsumption']);
  const [parsedData, setParsedData] = useState<AreaChartData[]>([]);
  const [deviceData, setDeviceData] = useState<any>(null);
  const [time, setTime] = useState(new Date());
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const isLandscape = WINDOW_WIDTH > WINDOW_HEIGHT;
  const lineColors = useMemo(
    () => ({
      positiveConsumption: '#FFA500',
      negativeConsumption: '#1E90FF',
      productionCleanVat: '#32CD32',
      totalConsumption: '#FF4444',
    }),
    []
  );

  useEffect(() => {
    if (data?.deviceList) {
      const defaultSignals = [
        {
          value: 'positiveConsumption',
          label: 'Consumo de red eléctrica',
          color: lineColors.positiveConsumption,
        },
        {
          value: 'negativeConsumption',
          label: 'Vuelco a red eléctrica',
          color: lineColors.negativeConsumption,
        },
        {
          value: 'productionCleanVat',
          label: 'Producción fotovoltaica',
          color: lineColors.productionCleanVat,
        },
        {
          value: 'totalConsumption',
          label: 'Consumo total',
          color: lineColors.totalConsumption,
        },
      ].filter((signal) => data[signal.value]?.length > 0);

      // Generate consistent colors for devices using HSL
      const deviceSignals = data.deviceList.map((device: any, index: number) => {
        const hue = (index * 137.508) % 360; // Golden angle for better color distribution
        const color = `hsl(${hue}, 70%, 50%)`;
        return {
          label: device.name,
          value: device.name,
          id: device._id,
          color: color,
        };
      });

      setAvailableSignals([...defaultSignals, ...deviceSignals]);
    }
  }, [data, lineColors]);

  useEffect(() => {
    const fetchDeviceData = async () => {
      if (!currentProperty || !selectedDay) return;

      const selectedDevices = selectedSignals
        .map((signal) => availableSignals?.find((s: any) => s.value === signal))
        .filter((signal) => signal && signal.id)
        .map((signal) => signal.id);

      if (selectedDevices.length > 0) {
        setIsLoadingDevices(true);
        try {
          const response = await getDayDevicesHistorical(currentProperty, moment(selectedDay).format('YYYY-MM-DD HH:mm:ss'), selectedDevices);

          const historicDevices = response.device?.map((item) => ({
            name: item.name,
            historic: item.historicDeviceAttribute
              .map((attr) => ({
                value: +attr.value,
                label: moment(attr.createdAt).format('HH:mm'),
                timestamp: new Date(`2000-01-01T${moment(attr.createdAt).format('HH:mm')}:00`).getTime(),
              }))
              .sort((a, b) => a.timestamp - b.timestamp),
          }));
          setDeviceData(historicDevices);
        } catch (error) {
          console.error('Error fetching device data:', error);
        }
        setIsLoadingDevices(false);
      }
    };

    fetchDeviceData();
  }, [selectedSignals, currentProperty, selectedDay, availableSignals]);

  const transformData = useCallback((rawData: any[], type: string, label: string, color: string): AreaChartData | null => {
    if (!rawData?.length) return null;

    return {
      id: type,
      label,
      color,
      gradientFrom: color,
      gradientTo: `${color}00`,
      data: rawData
        .filter((point) => point.label && point.value !== undefined)
        .map((point) => ({
          value: point.value,
          label: point.label,
          timestamp: new Date(`2000-01-01T${point.label}:00`).getTime(),
        }))
        .filter((point) => !isNaN(point.timestamp))
        .sort((a, b) => a.timestamp - b.timestamp),
    };
  }, []);

  useEffect(() => {
    if (data && selectedSignals && availableSignals) {
      try {
        const auxData = parseData(data, selectedSignals);
        const transformedData: AreaChartData[] = [];

        const standardSignals = [
          { value: 'positiveConsumption', type: 'positiveConsumption', label: 'Consumo de red eléctrica' },
          { value: 'negativeConsumption', type: 'negativeConsumption', label: 'Vuelco a red eléctrica' },
          { value: 'productionCleanVat', type: 'productionCleanVat', label: 'Producción fotovoltaica' },
          { value: 'totalConsumption', type: 'totalConsumption', label: 'Consumo total' },
        ];

        standardSignals.forEach(({ value, type, label }) => {
          if (auxData[value]?.length && selectedSignals.includes(type)) {
            const signalInfo = availableSignals.find((s: any) => s.value === type);
            const transformed = transformData(auxData[value], type, label, signalInfo.color);
            if (transformed) transformedData.push(transformed);
          }
        });

        if (deviceData) {
          deviceData.forEach((device: any) => {
            if (selectedSignals.includes(device.name)) {
              const signalInfo = availableSignals.find((s: any) => s.value === device.name);
              const transformed = transformData(device.historic, device.name, device.name, signalInfo.color);
              if (transformed) transformedData.push(transformed);
            }
          });
        }
        setParsedData(transformedData);
      } catch (error) {
        console.error('Error transforming data:', error);
        setParsedData([]);
      }
    }
  }, [data, selectedSignals, availableSignals, transformData, deviceData]);

  const renderGraph = (isLandscape = false) => {
    return (
      <View style={styles.graphWrapper}>
        {(parsedData.length === 0 || isLoadingDevices) && !isLoading && <ActivityIndicator size="large" color="#164E63" style={styles.loader} />}
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
    }
  };

  return (
    <View style={[styles.mainContainer, isLandscape && styles.landscapeContainer]}>
      {isLoading && <ActivityIndicator size="large" color="#164E63" style={styles.loader} />}
      {!isLandscape ? (
        <>
          <View style={styles.fixedSection}>
            <View style={styles.headerRow}>
              <View style={styles.datePickersContainer}>
                {Platform.OS == 'android' && (
                  <TouchableOpacity onPress={openDatePickHandler}>
                    <Text style={styles.title}>{selectedDay.toLocaleString()}</Text>
                  </TouchableOpacity>
                )}
                {Platform.OS !== 'android' && <>{<DateTimePicker testID="datePicker" value={selectedDay} mode="date" display="default" themeVariant="dark" onChange={onChange} />}</>}
              </View>
            </View>
          </View>

          <View style={styles.fullWidthContainer}>{renderGraph()}</View>

          <ScrollView style={styles.scrollSection} contentContainerStyle={styles.scrollContent}>
            <View style={styles.signalContainer}>
              {availableSignals && <SignalSelector availableSignals={availableSignals} setSelectedSignals={setSelectedSignals} selectedSignals={selectedSignals} />}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.landscapeGraphContainer}>{renderGraph(true)}</View>
      )}
    </View>
  );
});

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
    padding: 0,
  },
  fixedSection: {
    backgroundColor: '#0F242A',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  fullWidthContainer: {
    marginLeft: -16,
    marginRight: -16,
    backgroundColor: '#0F242A',
  },
  graphWrapper: {
    width: SCREEN_WIDTH,
    maxHeight: 300,
    overflow: 'hidden',
    backgroundColor: '#083344',
    borderRadius: 15,
    padding: 4,
  },
  graphContainer: {
    backgroundColor: '#0F242A',
  },
  landscapeGraphContainer: {
    flex: 1,
    backgroundColor: '#0F242A',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    top: '45%',
    left: '45%',
    zIndex: 999,
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

export default PropertyGraph;
