import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ROLES, URLS } from "@/utils/constants";
import { router } from "expo-router";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InstallerDashboard from "@/components/dashboard/InstallerDashboard";
import useAuthStore from "@/stores/useAuthStore";

type RootStackParamList = {
  SignIn: undefined;
  AdminDashboard: undefined;
  InstallerDashboard: undefined;
  OwnerDashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Dashboard() {
  const { userInfo } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      router.replace(URLS.SIGN_IN);
    }
  }, [userInfo, navigation]);

  if (!userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      {userInfo.user.type === ROLES.OWNER && <OwnerDashboard />}
      {userInfo.user.type === ROLES.ADMIN && <AdminDashboard />}
      {userInfo.user.type === ROLES.INSTALLER && <InstallerDashboard />}
    </>
  );
}
