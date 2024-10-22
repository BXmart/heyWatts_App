import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Tab {
  id: string;
  title: string;
}

interface TabNavigatorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  containerStyle?: object;
  tabStyle?: object;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ tabs, activeTab, onTabChange, containerStyle, tabStyle }) => {
  return (
    <View style={[styles.tabContainer, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.id} style={[styles.tab, tabStyle, activeTab === tab.id && styles.activeTab]} onPress={() => onTabChange(tab.id)}>
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.title}</Text>
          {activeTab === tab.id && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#0F242A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A3B41",
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    color: "#8E9BA0",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 3,
    backgroundColor: "#4ADE80",
    borderRadius: 1.5,
    left: "25%", // Centers the indicator
  },
});

export default TabNavigator;
