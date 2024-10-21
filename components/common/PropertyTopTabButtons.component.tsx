import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const PropertyTopTabButtons = ({ onTabChange, tabs }: any) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabPress = (tabId: any) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {tabs.map((tab: any) => (
          <TouchableOpacity key={tab.id} onPress={() => handleTabPress(tab.id)} style={styles.tabButton}>
            <Text style={[styles.tabText, activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText]}>{tab.label}</Text>
            {activeTab === tab.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  scrollView: {
    flexDirection: "row",
  },
  tabButton: {
    padding: 15,
    flex: 1,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#DBFFE8",
  },
  inactiveTabText: {
    color: "#6b7280",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#DBFFE8",
  },
});

export default PropertyTopTabButtons;
