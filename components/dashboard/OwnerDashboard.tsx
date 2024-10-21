import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DashboardGraph from "./graphs/DashboardGraph";
import useAuthStore from "@/stores/useAuthStore";
import useDashboard from "@/hooks/useDashboardHook";
import { getOwnerInvoice, InvoiceData } from "@/services/dashboard.service";
import TopSwiperCards from "./components/InfoCards/TopSwiperCards";
import MarketPriceGraphs from "./graphs/MarketGraph";
import { analyzeCompPrices, analyzeEnergyPrices } from "./utils/circularTimeRangeUtils";
import CircularTimeRangesSwiper from "./components/CircularTimeRange/CircularTimeRangesSwiper.component";
import PropertyInfograph from "./components/PropertyInfograph";
import { PagedPropertiesResponseI } from "@/context/TabsContext";

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <PropertyInfograph data={dashboardData} hasBattery={true} hasInverter={true} isLoading={isLoading} />
        <CircularTimeRangesSwiper energySlots={energySlots} compSlots={compSlots} />
      </View>
      {<TopSwiperCards data={dashboardData} hasMeterDevices={true} />}
      <DashboardGraph dashboardData={dashboardData} initialData={consumptionData} currentProperty={currentProperty} marketPrices={marketPrices} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  header: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default OwnerDashboard;
