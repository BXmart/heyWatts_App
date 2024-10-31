import PropertySelector from '@/components/common/PropertySelector.component';
import PropertyTopTabButtons from '@/components/common/PropertyTopTabButtons.component';
import TabNavigator from '@/components/common/TabNavigator.component';
import DevicesList from '@/components/property/components/DevicesList.component';
import PropertyGraph from '@/components/property/components/PropertyGraph/PropertyGraph';
import { useProperty } from '@/hooks/property/usePropertyHook';
import useAuthStore from '@/stores/useAuthStore';
import { ROLES } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const tabs = [
  { id: 'devices', title: 'Dispositivos' },
  { id: 'propertyGraph', title: 'Gráfica consumos' },
];

const PropertyPage = ({ onTabChange }: any) => {
  const { user } = useAuthStore();
  const { isPropertyOwner, propertyDetailsData } = useProperty();
  const [activeTab, setActiveTab] = useState('devices');

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Renders the content of the active tab.
   *
   * @returns The content of the active tab.
   */
  /******  b6bceda1-2cae-4785-a597-b129cb2f1af8  *******/ const renderContent = () => {
    switch (activeTab) {
      case 'propertyGraph':
        return <PropertyGraph />;
      case 'devices':
        return <DevicesList propertyDetails={propertyDetailsData} />;
      default:
        return <PropertyGraph />;
    }
  };

  if (isPropertyOwner || (user && user.user.type === ROLES.OWNER)) {
    return (
      <View style={styles.container}>
        <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={{ padding: 16, height: '100%', width: '100%' }}>
          <PropertySelector />
          <View style={styles.content}>{renderContent()}</View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Coming soon!</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F242A',
  },
  content: {
    flex: 1,
  },
});

export default PropertyPage;
