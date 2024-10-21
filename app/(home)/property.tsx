import PropertySelector from "@/components/common/PropertySelector.component";
import PropertyTopTabButtons from "@/components/common/PropertyTopTabButtons.component";
import DevicesList from "@/components/property/components/DevicesList.component";
import PropertyGraph from "@/components/property/components/PropertyGraph";
import { useProperty } from "@/hooks/property/usePropertyHook";
import useAuthStore from "@/stores/useAuthStore";
import { ROLES } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const tabs = [
  { id: "propertyGraph", label: "Gráfica consumos" },
  { id: "devices", label: "Dispositivos" },
];

const PropertyPageSelector = ({ onTabChange }: any) => {
  const { user } = useAuthStore();
  const { isPropertyOwner, propertyDetailsData } = useProperty();
  const [activeTab, setActiveTab] = useState("propertyGraph");

  const handleTabChange = (tabId: any) => {
    setActiveTab(tabId);
  };

  useEffect(() => {}, [propertyDetailsData]);

  const renderContent = () => {
    switch (activeTab) {
      case "propertyGraph":
        return <PropertyGraph />;
      case "devices":
        return <DevicesList propertyDetails={propertyDetailsData} />;
      default:
        return <PropertyGraph />;
    }
  };

  if (isPropertyOwner || (user && user.user.type === ROLES.OWNER)) {
    return (
      <View style={styles.container}>
        <PropertyTopTabButtons onTabChange={handleTabChange} tabs={tabs} />
        <PropertySelector />
        <View style={styles.content}>{renderContent()}</View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#083344",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default PropertyPageSelector;
