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
import { View } from "@/components/Themed";

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
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Entypo name="bar-graph" size={24} color="black" />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>{({ pressed }) => <AntDesign name="user" size={24} color={Colors[colorScheme ?? "light"].text} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />}</Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="property"
        options={{
          title: "Property",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
