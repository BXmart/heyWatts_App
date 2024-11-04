import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import useAuthStore from '@/stores/useAuthStore';
import { getEnergyPricesByPropertyId } from '@/services/dashboard.service';
import { getEnergyCompensationPricesByPropertyId } from '@/services/properties.service';
import PriceEnergyGraph from './components/PriceEnergyGraph';
import ExcessCompensationGraph from './components/ExcessCompensationGraph';
import { EnergyDayPriceI, OwnerDashboardI } from '@/types/OwnerDashboard';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

interface MarketPriceGraphsProps {
  data: OwnerDashboardI;
  energyPrice: EnergyDayPriceI[];
  energyCompPrice: EnergyDayPriceI[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const MarketPriceGraphs: React.FC<MarketPriceGraphsProps> = ({ data, energyPrice, energyCompPrice, currentDate, setCurrentDate }) => {
  const [helpVisible, setHelpVisible] = useState(false);
  const [energyPriceState, setEnergyPriceState] = useState(energyPrice);
  const [energyCompPriceState, setEnergyCompPriceState] = useState(energyCompPrice);
  const [graphMode, setGraphMode] = useState(0);

  const { user } = useAuthStore();
  const hasInverter = data?.deviceDashboard?.inverterHuawei !== 0 || data?.deviceDashboard?.inverterFronius !== 0;

  const getDisplayDate = () => {
    const today = moment().format('YYYY-MM-DD');
    if (currentDate > today) return 'hoy';
    return currentDate === today ? 'hoy' : moment(currentDate).format('DD/MM/YYYY');
  };

  useEffect(() => {
    const fetchPrices = async () => {
      if (currentDate > moment().format('YYYY-MM-DD')) return;

      const formattedDate = moment(new Date(currentDate)).startOf('day').format('YYYY-MM-DD HH:mm:ss');

      const [energyPrices, compPrices] = await Promise.all([
        getEnergyPricesByPropertyId(user?.user.propertyByDefault?._id!, formattedDate),
        getEnergyCompensationPricesByPropertyId(user?.user.propertyByDefault?._id!, formattedDate),
      ]);

      setEnergyPriceState(energyPrices);
      setEnergyCompPriceState(compPrices);
    };

    fetchPrices();
  }, [currentDate, user?.user.propertyByDefault?._id]);

  const renderHelpTooltip = () => (
    <View style={styles.tooltipContainer}>
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>Los datos mostrados son el resultado del mercado diario ajustados a tu tarifa en €/kWh.</Text>
      </View>
      <View style={styles.tooltipArrow} />
    </View>
  );

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      <Ionicons name="stats-chart-outline" size={48} color="#9CA3AF" />
      <Text style={styles.noDataText}>No se han obtenido datos sobre el precio de la luz. Por favor, inténtelo más tarde.</Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.helpButton} onPress={() => setHelpVisible(!helpVisible)}>
        <Ionicons name="help-circle-outline" size={24} color={helpVisible ? '#10B981' : '#9CA3AF'} />
      </TouchableOpacity>

      {helpVisible && renderHelpTooltip()}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{graphMode === 0 ? `Precio de la luz de ${getDisplayDate()}` : `Compensación por excedentes de ${getDisplayDate()}`}</Text>

        {energyPrice.length === 0 ? (
          renderNoData()
        ) : (
          <>
            {hasInverter && (
              <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                  values={['Precio de la luz', 'Comp. por excedentes']}
                  selectedIndex={graphMode}
                  onChange={(event) => {
                    setGraphMode(event.nativeEvent.selectedSegmentIndex);
                  }}
                  style={styles.segmentedControl}
                />
              </View>
            )}

            <View style={styles.graphContainer}>{graphMode === 0 ? <PriceEnergyGraph data={energyPriceState} /> : <ExcessCompensationGraph data={energyCompPriceState} />}</View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.infoHighlight}>¿Has visto el precio de la luz de hoy?</Text> Compruebe los tramos de precio más bajos para optimizar su consumo.
              </Text>
            </View>
          </>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 0,
    shadowColor: 'transparent',
  },
  contentContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    minHeight: 460,
    elevation: 0,
    shadowColor: 'transparent',
  },
  helpButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 3,
    width: 240,
  },
  tooltip: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    right: 12,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  tooltipText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F3F4F6',
    marginBottom: 20,
  },
  segmentedControlContainer: {
    marginBottom: 20,
  },
  segmentedControl: {
    height: 40,
  },
  graphContainer: {
    flex: 1,
    minHeight: 280,
    marginBottom: 20,
    backgroundColor: '#0F242A',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  infoContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  infoText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: '600',
    color: '#10B981',
  },
});

export default MarketPriceGraphs;
