import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardGraph from "./graphs/DashboardGraph";
import useAuthStore from "@/stores/useAuthStore";
import useDashboard from "@/hooks/useDashboardHook";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

const OwnerDashboard: React.FC = () => {
  const { userInfo } = useAuthStore();
  const { loading, error, setPropertyId } = useDashboard();

  const glob = useGlobalSearchParams<{ propertyId: string }>();
  const local = useLocalSearchParams();

  useEffect(() => {
    if (glob.propertyId) setPropertyId(glob.propertyId);
  }, [glob]);

  if (!userInfo) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.subtitle}>Panel de control</Text>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido, {userInfo.user.name}</Text>
        </View>

        {loading ? <Text>Loading..asds.</Text> : error ? <Text>Error: {error}</Text> : <DashboardGraph />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default OwnerDashboard;
