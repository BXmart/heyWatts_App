import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAuthStore from '@/stores/useAuthStore';
import { useState } from 'react';
import TabNavigator from '@/components/common/TabNavigator.component';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropertyEditScreen from './property-settings';
import UserSettings from './user-settings';
import { THEME } from '@/utils/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from 'expo-router';

export default function SettingsScreen() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('user');
  const navigation = useNavigation();

  const tabs = [
    { id: 'user', title: 'User' },
    { id: 'property', title: 'Property' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserSettings />;
      case 'property':
        return <PropertyEditScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color={THEME.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.headerRight} />
      </View>
      <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.backgroundDefault,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.backgroundDefault,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRight: {
    width: 40, // To balance the header layout with the back button
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: THEME.border,
  },
  button: {
    backgroundColor: THEME.lightBlue,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: THEME.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
