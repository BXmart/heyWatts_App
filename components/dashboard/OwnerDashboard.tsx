import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardGraph from "./graphs/DashboardGraph";
import useAuthStore from "@/stores/useAuthStore";
import useDashboard from "@/hooks/useDashboardHook";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { PagedPropertiesResponseI } from "@/app/(home)";
import PropertyInfograph from "./components/PropertyInfograph";
import { getOwnerInvoice, InvoiceData } from "@/services/dashboard.service";
import OwnerDashboardTodayMoneyCard from "./components/info-cards/OwnerDashboardTodayMoneyCard";
import OwnerDashboardPredictMoneyCard from "./components/info-cards/OwnerDashboardPredictMoneyCard";
import OwnerDashboardTopEnergyConsumedCard from "./components/info-cards/OwnerDashboardTopEnergyConsumed";
import OwnerDashboardTopMoneyConsumedCard from "./components/info-cards/OwnerDashboardTopMoneyCard";
import TopSwiperCards from "./components/info-cards/TopSwiperCards";
import MarketPriceGraphs from "./graphs/MarketGraph";

const OwnerDashboard = ({
  consumptionData,
  dashboardData,
  properties,
  marketPrices,
  currentProperty,
  setCurrentProperty,
}: {
  consumptionData: any;
  dashboardData: any;
  properties: PagedPropertiesResponseI;
  marketPrices: any;
  currentProperty: string | undefined;
  setCurrentProperty: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { user, isLoading } = useAuthStore();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const { currentDate } = useDashboard();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getOwnerInvoice(user!.user.propertyByDefault?._id!);
        console.log({ response });
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
        <Text>Loading...{!user}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TopSwiperCards data={dashboardData} hasMeterDevices={true} />
      <DashboardGraph initialData={consumptionData} currentProperty={currentProperty} />
      <MarketPriceGraphs
        data={dashboardData}
        energyPrice={marketPrices}
        energyCompPrice={marketPrices.energyCompPrice}
        currentDate={currentDate}
        handleGraphModeChange={() => {}}
        graphMode={0}
        setCurrentDate={() => {}}
      />
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
