import "react-native-reanimated";
import { View, Text } from "react-native";
import useAuthStore from "@/stores/useAuthStore";
import { Dropdown } from "react-native-element-dropdown";
import { useTabsContext } from "../../context/TabsContext";
import { remapProps } from "nativewind";
import PropertySelector from "@/components/common/PropertySelector.component";
import { useProperty } from "@/hooks/property/usePropertyHook";
import { useEffect } from "react";
import { ROLES } from "@/utils/constants";
import PropertyGraph from "@/components/dashboard/graphs/PropertyGraph";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { propertyDetailsData, isPropertyOwner } = useProperty();

  if (isPropertyOwner || (user && user.user.type === ROLES.OWNER)) {
    return (
      <View className="flex-1 p-5 bg-background-default">
        <PropertySelector />
        <PropertyGraph />
      </View>
    );
  }
}
