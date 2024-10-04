import { Redirect, Slot, Link, Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import { Text, useColorScheme } from "react-native";
import { URLS } from "@/utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "react-native";
import Colors from "@/utils/Colors";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import useAuthStore from "@/stores/useAuthStore";

export default function HomeLayout() {
  const { loading, userInfo, initialize } = useAuthStore();
  const colorScheme = useColorScheme();
  useEffect(() => {
    //Initialize checks user token
    initialize();
  }, []);

  if (loading) {
    return <Text>Loading...asd</Text>;
  }

  if (!userInfo || (!userInfo.token && !loading)) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: "gray" }}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
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
          title: "Propiedad",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
