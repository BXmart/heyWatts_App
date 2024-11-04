import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DashboardGraph from './graphs/DashboardGraph';
import useAuthStore from '@/stores/useAuthStore';
import useDashboard from '@/hooks/useDashboardHook';
import { getOwnerInvoice, InvoiceData } from '@/services/dashboard.service';
import TopSwiperCards from './components/InfoCards/TopSwiperCards';
import MarketPriceGraphs from './graphs/MarketGraph';
import { analyzeCompPrices, analyzeEnergyPrices } from './utils/circularTimeRangeUtils';
import CircularTimeRangesSwiper from './components/CircularTimeRange/CircularTimeRangesSwiper.component';
import PropertyInfograph from './components/PropertyInfograph';
import { PagedPropertiesResponseI } from '@/context/TabsContext';

const OwnerDashboard = ({
  consumptionData,
  dashboardData,
  properties,
  marketPrices,
  compensationPrices,
  isLoading,
}: {
  consumptionData: any;
  dashboardData: any;
  properties: PagedPropertiesResponseI | undefined;
  marketPrices: any;
  compensationPrices: any[];
  isLoading: boolean;
}) => {
  const { user, currentProperty, setCurrentProperty } = useAuthStore();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const energySlots = analyzeEnergyPrices(marketPrices);
  const compSlots = analyzeCompPrices(compensationPrices);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getOwnerInvoice(user!.user.propertyByDefault?._id!);
        setInvoiceData(response);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasBattery = dashboardData?.deviceDashboard?.batteries !== 0;
  const hasInverter = dashboardData?.deviceDashboard?.inverterHuawei !== 0 || dashboardData?.deviceDashboard?.inverterFronius !== 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={{ flex: 1, flexDirection: 'row', height: 220, gap: 5 }}>
        <PropertyInfograph data={dashboardData} hasBattery={hasBattery} hasInverter={hasInverter} isLoading={isLoading} />
        <CircularTimeRangesSwiper energySlots={energySlots} compSlots={compSlots} showCompSlots={hasInverter} />
      </View>
      <TopSwiperCards data={dashboardData} hasMeterDevices={true} />
      <DashboardGraph dashboardData={dashboardData} initialData={consumptionData} currentProperty={currentProperty} marketPrices={marketPrices} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 220,
    gap: 5,
  },
  scrollView: {
    flexGrow: 1,
    padding: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  header: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OwnerDashboard;
