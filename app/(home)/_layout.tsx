import { Link, Redirect, Tabs, useRouter } from "expo-router";
import React, { PropsWithChildren, ReactElement, ReactNode, ReactPortal, useEffect } from "react";
import { Pressable, useColorScheme } from "react-native";
import { URLS } from "@/utils/constants";
import Colors from "@/utils/Colors";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Entypo from "@expo/vector-icons/Entypo";
import useAuthStore from "@/stores/useAuthStore";
import { Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

export default function HomeLayout() {
  const { user, isLoading } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();

  if (isLoading) {
    return <Text>Loading root</Text>;
  }

  if (!user) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#083344",
        },
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerStyle: {
            shadowColor: "black",
            shadowRadius: 4,
            backgroundColor: "#083344",
          },
          headerTitleStyle: {
            color: "#DBFFE8",
            fontWeight: "bold",
            fontSize: 23,
          },
          tabBarActiveBackgroundColor: "#035170",
          tabBarIcon: ({ color }) => <MaterialIcons name="space-dashboard" size={24} color="#DBFFE8" />,
          tabBarLabelStyle: {
            color: "#DBFFE8",
          },
          headerRight: () => (
            <Link href="/modal" asChild style={{ paddingRight: 15 }}>
              <Pressable>{({ pressed }) => <Feather name="settings" size={24} color="#DBFFE8" />}</Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="property"
        options={{
          title: "Property",
          headerStyle: {
            shadowColor: "black",
            shadowRadius: 4,
            backgroundColor: "#083344",
          },
          headerTitleStyle: {
            color: "#DBFFE8",
            fontWeight: "bold",
            fontSize: 23,
          },
          tabBarActiveBackgroundColor: "#035170",
          tabBarIcon: ({ color }) => <FontAwesome6 name="house-chimney" size={24} color="#DBFFE8" />,
          tabBarLabelStyle: {
            color: "#DBFFE8",
          },
          headerRight: () => (
            <Link href="/modal" asChild style={{ paddingRight: 15 }}>
              <Pressable>{({ pressed }) => <Feather name="settings" size={24} color="#DBFFE8" />}</Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: "Sugerencias",
          headerStyle: {
            shadowColor: "black",
            shadowRadius: 4,
            backgroundColor: "#083344",
          },
          headerTitleStyle: {
            color: "#DBFFE8",
            fontWeight: "bold",
            fontSize: 23,
          },
          tabBarActiveBackgroundColor: "#035170",
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color="#DBFFE8" />,
          tabBarLabelStyle: {
            color: "#DBFFE8",
          },
          headerRight: () => (
            <Link href="/modal" asChild style={{ paddingRight: 15 }}>
              <Pressable>{({ pressed }) => <Feather name="settings" size={24} color="#DBFFE8" />}</Pressable>
            </Link>
          ),
        }}
      />

      {/* <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
      }}
    /> */}
    </Tabs>
  );
}
