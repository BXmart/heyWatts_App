import { Link, Redirect, Stack, Tabs, useNavigation, useRouter } from 'expo-router';
import React, { PropsWithChildren, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { URLS } from '@/utils/constants';
import Colors from '@/utils/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Entypo from '@expo/vector-icons/Entypo';
import useAuthStore from '@/stores/useAuthStore';
import { Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { getEnergyCompensationPricesByPropertyId, getPagesPropertiesByUserId, getPropertyDetailsById } from '@/services/properties.service';
import { getDashboardConsumptionAndPredictionGraph, getEnergyPricesByPropertyId, getOwnerDashboard, getOwnerInvoice } from '@/services/dashboard.service';
import moment from 'moment';
import { EnergyDayPriceI, OwnerDashboardI } from '@/types/OwnerDashboard';
import { DetailPropertyI } from '@/types/DetailProperty';
import { View } from '@/components/Themed';
import { PagedPropertiesResponseI, TabsContextType, TabsProvider } from '../../context/TabsContext';
import Fontisto from '@expo/vector-icons/Fontisto';
import LoadingScreen from '@/components/common/SkeletonLoader/SkeletonLoader.component';

export default function HomeLayout() {
  const { user, isLoading, setCurrentProperty } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  const [dashboardData, setDashboardData] = useState<any>([]);
  const [consumptionData, setConsumptionData] = useState<any>([]);
  const [properties, setProperties] = useState<PagedPropertiesResponseI>();
  const [marketPrices, setMarketPrices] = useState<any>([]);
  const [compensationPrices, setCompensationPrices] = useState<any>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user && user.user.propertyByDefault?._id && !isInitialized) {
      initialize()
        .then(([dashboardData, propertyDetails, properties, consumptionData, marketPrices, compensationPrices]) => {
          setDashboardData(dashboardData as OwnerDashboardI);
          setCurrentProperty((propertyDetails as DetailPropertyI)._id);
          setProperties(properties);
          setConsumptionData(consumptionData as EnergyDayPriceI[]);
          setMarketPrices(marketPrices);
          setCompensationPrices(compensationPrices);
          setIsInitialized(true);
        })
        .catch((error) => {
          console.error(error);
          setIsInitialized(true);
        });
    }
  }, [user]);

  const initialize = async () => {
    return await Promise.all([
      getOwnerDashboard(user!.user.propertyByDefault?._id!),
      getPropertyDetailsById(user!.user.propertyByDefault?._id!),
      getPagesPropertiesByUserId({ userId: user!.user._id, pageSize: '50' }),
      getDashboardConsumptionAndPredictionGraph({ propertyId: user!.user.propertyByDefault?._id!, date: moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss') }),
      getEnergyPricesByPropertyId(user!.user.propertyByDefault?._id!, moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')),
      getEnergyCompensationPricesByPropertyId(user!.user.propertyByDefault?._id!, moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')),
    ]);
  };

  const propertiesList = properties?.content.map((property: any) => ({ id: property._id, value: property._id, label: property.name })) ?? [];

  const contextValue: TabsContextType = {
    dashboardData,
    consumptionData,
    properties,
    marketPrices,
    compensationPrices,
    propertiesList,
  };

  if (isLoading || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingScreen />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={URLS.SIGN_IN} />;
  }

  const commonScreenOptions = {
    headerStyle: {
      shadowColor: 'black',
      shadowRadius: 4,
      backgroundColor: '#0F242A',
    },
    headerTitleStyle: {
      color: '#DBFFE8',
      fontWeight: 'bold',
      fontSize: 23,
    },
    tabBarActiveBackgroundColor: '#035170',
    tabBarLabelStyle: {
      color: '#DBFFE8',
    },
    headerRight: () => (
      <Link href="/modal" asChild style={{ paddingRight: 15 }}>
        <Pressable>{({ pressed }) => <Feather name="settings" size={24} color="#DBFFE8" />}</Pressable>
      </Link>
    ),
  };

  return (
    <TabsProvider value={contextValue}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0F242A',
          },
          ...commonScreenOptions,
          lazy: false, // Disable lazy loading of tabs
        }}
        backBehavior="history"
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <MaterialIcons name="space-dashboard" size={24} color="#DBFFE8" />,
          }}
        />
        <Tabs.Screen
          name="property"
          options={{
            title: 'Propiedad',
            tabBarIcon: ({ color }) => <FontAwesome6 name="house-user" size={24} color="#DBFFE8" />,
          }}
        />
        <Tabs.Screen
          name="proposals"
          options={{
            title: 'Simulaciones',
            tabBarIcon: ({ color }) => <Fontisto name="lightbulb" size={24} color="#DBFFE8" />,
          }}
        />
        <Tabs.Screen
          name="invoices"
          options={{
            title: 'Facturas',
            tabBarIcon: ({ color }) => <FontAwesome6 name="file-invoice" size={24} color="#DBFFE8" />,
          }}
        />
      </Tabs>
    </TabsProvider>
  );
}
