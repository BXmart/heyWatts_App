import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { ROLES, URLS } from '@/utils/constants';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import InstallerDashboard from '@/components/dashboard/InstallerDashboard';
import useAuthStore from '@/stores/useAuthStore';
import { useTabsContext } from '../../context/TabsContext';
import PropertySelector from '@/components/common/PropertySelector.component';

export interface PropertyI {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const { dashboardData, consumptionData, properties, marketPrices, compensationPrices } = useTabsContext();
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const handleCTApress = () => {
    router.push('/understand-your-bill');
  };

  if (!user) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PropertySelector />

        {user.user.type === ROLES.OWNER && (
          <OwnerDashboard
            consumptionData={consumptionData}
            dashboardData={dashboardData}
            properties={properties}
            marketPrices={marketPrices}
            compensationPrices={compensationPrices}
            isLoading={isLoading || !dashboardData || !consumptionData || !properties || !marketPrices || !compensationPrices}
          />
        )}
        {user.user.type === ROLES.ADMIN && <AdminDashboard />}
        {user.user.type === ROLES.INSTALLER && <InstallerDashboard />}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCTApress} activeOpacity={0.8}>
        <Text style={styles.fabText}>Entiende tu factura</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F242A',
  },
  scrollContent: {
    padding: 0,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4ADE80', // green color
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});
