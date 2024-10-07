import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Redirect } from "expo-router";
import { ROLES, URLS } from "@/utils/constants";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InstallerDashboard from "@/components/dashboard/InstallerDashboard";
import useAuthStore from "@/stores/useAuthStore";
import { getEnergyCompensationPricesByPropertyId, getPagesPropertiesByUserId } from "@/services/properties.service";
import { getDashboardConsumptionAndPredictionGraph, getEnergyPricesByPropertyId, getOwnerDashboard, getOwnerInvoice } from "@/services/dashboard.service";
import moment from "moment";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { set } from "zod";

export interface PropertyI {
  _id: string;
  name: string;
  description: string;
}
export interface PagedPropertiesResponseI {
  content: PropertyI[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export default function Dashboard() {
  const { user, isLoading } = useAuthStore();
  const [currentProperty, setCurrentProperty] = useState(user!.user.propertyByDefault?._id ?? undefined);
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [consumptionData, setConsumptionData] = useState<any>([]);
  const [properties, setProperties] = useState<PagedPropertiesResponseI>();
  const [marketPrices, setMarketPrices] = useState<any>([]);
  const [compensationPrices, setCompensationPrices] = useState<any>([]);

  useEffect(() => {
    if (user && user!.user.propertyByDefault?._id) {
      initialize()
        .then(([dashboardData, properties, consumptionData, marketPrices, compensationPrices]) => {
          setDashboardData(dashboardData);
          setProperties(properties);
          setConsumptionData(consumptionData);
          setMarketPrices(marketPrices);
          setCompensationPrices(compensationPrices);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const initialize = async () => {
    return await Promise.all([
      getOwnerDashboard(user!.user.propertyByDefault?._id!),
      getPagesPropertiesByUserId({ userId: user!.user._id, pageSize: "50" }),
      getDashboardConsumptionAndPredictionGraph({ propertyId: user!.user.propertyByDefault?._id!, date: moment(new Date().setHours(0, 0, 0, 0)).format("YYYY-MM-DD HH:mm:ss") }),
      getEnergyPricesByPropertyId(user!.user.propertyByDefault?._id!, moment(new Date().setHours(0, 0, 0, 0)).format("YYYY-MM-DD HH:mm:ss")),
      getEnergyCompensationPricesByPropertyId(user!.user.propertyByDefault?._id!, moment(new Date().setHours(0, 0, 0, 0)).format("YYYY-MM-DD HH:mm:ss")),
    ]);
  };

  if (!properties) {
    return (
      <View style={styles.container}>
        <Text>Loading...Properties</Text>
      </View>
    );
  }

  const propertiesList = properties!.content.map((property: any) => ({ id: property._id, value: property._id, label: property.name }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={propertiesList}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Sectiona una propiedad"}
        searchPlaceholder="Search..."
        value={currentProperty}
        onChange={(item) => {
          setCurrentProperty(item.value);
        }}
      />

      {user.user.type === ROLES.OWNER && (
        <OwnerDashboard
          consumptionData={consumptionData}
          dashboardData={dashboardData}
          properties={properties}
          marketPrices={marketPrices}
          currentProperty={currentProperty}
          setCurrentProperty={setCurrentProperty}
        />
      )}
      {user.user.type === ROLES.ADMIN && <AdminDashboard />}
      {user.user.type === ROLES.INSTALLER && <InstallerDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
