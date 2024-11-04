import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Redirect } from 'expo-router';
import { ROLES, URLS } from '@/utils/constants';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import InstallerDashboard from '@/components/dashboard/InstallerDashboard';
import useAuthStore from '@/stores/useAuthStore';
import { useTabsContext } from '../../context/TabsContext';
import PropertySelector from '@/components/common/PropertySelector.component';
import UnderstandYourBillCTA from '@/components/common/UnderstandYourBillCTA';

export interface PropertyI {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const { dashboardData, consumptionData, properties, marketPrices, compensationPrices } = useTabsContext();
  const { user, isLoading } = useAuthStore();

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
      <UnderstandYourBillCTA />
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
});
