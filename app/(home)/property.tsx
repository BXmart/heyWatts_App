import "react-native-reanimated";
import { View, Text } from "react-native";
import useAuthStore from "@/stores/useAuthStore";
import { Dropdown } from "react-native-element-dropdown";
import { useTabsContext } from "./context/TabsContext";
import { remapProps } from "nativewind";
import PropertySelector from "@/components/common/PropertySelector.component";
import { useProperty } from "@/hooks/property/usePropertyHook";
import { useEffect } from "react";

export default function Dashboard() {
  const { propertyDetailsData, reloadPropertyData } = useProperty();

  useEffect(() => {
    console.log({ propertyDetailsData });
  }, [propertyDetailsData]);

  return (
    <View className="flex-1 p-5 bg-background-default">
      <PropertySelector />
    </View>
  );
}
