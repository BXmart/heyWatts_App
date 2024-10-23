import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import BillInfo from "@/components/understand-bill/BillInfo.component";
import BillParts from "@/components/understand-bill/BillParts.component";
import TabNavigator from "@/components/common/TabNavigator.component";

const tabs = [
  { id: "desglose", title: "Desglose" },
  { id: "info", title: "Info" },
];

export default function UnderstandYourBillPage() {
  const [activeTab, setActiveTab] = useState<string>("desglose");
  const [scrollPosition] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const renderTabContent = () => {
    switch (activeTab) {
      case "desglose":
        return <BillParts />;
      case "info":
        return <BillInfo />;
      default:
        return null;
    }
  };

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollPosition.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  // Scroll event handler with animation
  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollPosition } } }], {
    useNativeDriver: true,
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Only apply safe area to the top part */}
      <View style={{ paddingTop: insets.top, backgroundColor: "#0F242A" }}>
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entiende tu Factura</Text>
        </Animated.View>

        <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Content area */}
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={{
          paddingBottom: insets.bottom, // Add bottom padding for safe area
        }}
      >
        {renderTabContent()}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F242A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0F242A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A3B41",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#0F242A",
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#4ADE80",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  introText: {
    color: "#B0BEC5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  componentCard: {
    backgroundColor: "#1A2F36",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mainComponentCard: {
    backgroundColor: "#1A2F36",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4ADE80",
  },
  componentTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mainComponentTitle: {
    color: "#4ADE80",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subSectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  subSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#2A3B41",
  },
  subComponentTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  detailTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  subComponentContainer: {
    marginTop: 12,
  },
  tariffItem: {
    marginBottom: 12,
  },
  tariffTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  tariffDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 20,
  },
  chargeItem: {
    marginBottom: 12,
  },
  chargeTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  taxItem: {
    marginBottom: 16,
  },
  taxTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  componentDescription: {
    color: "#B0BEC5",
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    color: "#B0BEC5",
    fontSize: 16,
    lineHeight: 24,
  },
  actorsList: {
    borderLeftWidth: 2,
    borderLeftColor: "#2A3B41",
    paddingLeft: 20,
  },
  actorItem: {
    marginBottom: 20,
  },
  actorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 12,
    marginLeft: -24,
  },
  actorTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  actorDescription: {
    color: "#B0BEC5",
    fontSize: 15,
    lineHeight: 22,
    paddingLeft: 0,
  },
});
