import React from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { ROLES, URLS } from "@/utils/constants";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InstallerDashboard from "@/components/dashboard/InstallerDashboard";
import useAuthStore from "@/stores/useAuthStore";
import { useTabsContext } from "./context/TabsContext";
import PropertySelector from "@/components/common/PropertySelector.component";

export interface PropertyI {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const { dashboardData, consumptionData, properties, marketPrices, compensationPrices } = useTabsContext();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-deep-blue">
        <Text className="text-mint-green">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  return (
    <View className="flex-1 p-5 bg-background-default">
      <PropertySelector />

      {user.user.type === ROLES.OWNER && (
        <OwnerDashboard consumptionData={consumptionData} dashboardData={dashboardData} properties={properties} marketPrices={marketPrices} compensationPrices={compensationPrices} />
      )}
      {user.user.type === ROLES.ADMIN && <AdminDashboard />}
      {user.user.type === ROLES.INSTALLER && <InstallerDashboard />}
    </View>
  );
}
