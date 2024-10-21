import React from "react";
import { View, StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import { setMachineStatusBadge } from "./MachineStatusBadge.component";

const ConsumProductBadges = ({ props }) => {
  const { deviceData, generalData } = props;
  if (!deviceData || !generalData) return null;
  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>{setMachineStatusBadge(deviceData.machineStatus)}</View>

      {/* HUAWEI */}
      <View style={styles.badgeRow}>
        {deviceData.authorizedDevice.category === "inverter" && deviceData.authorizedDevice.brand.toLowerCase() === "huawei" && generalData.consumptionAvailableApi === 1 && (
          <View style={styles.badgeContainer}>
            <Badge style={[styles.badge, styles.orangeBadge]}>Consumo</Badge>
          </View>
        )}

        {deviceData.authorizedDevice.category === "inverter" &&
          deviceData.authorizedDevice.brand.toLowerCase() === "huawei" &&
          (generalData.productionAvailableApi === 1 || generalData.productionAvailableApi === 3) && (
            <View style={styles.badgeContainer}>
              <Badge style={[styles.badge, styles.greenBadge]}>Producción</Badge>
            </View>
          )}
      </View>

      {/* FRONIUS */}
      <View style={styles.badgeRow}>
        {deviceData.authorizedDevice.category === "inverter" && deviceData.authorizedDevice.brand.toLowerCase() === "fronius" && generalData.consumptionAvailableApi === 2 && (
          <View style={styles.badgeContainer}>
            <Badge style={[styles.badge, styles.orangeBadge]}>Consumo</Badge>
          </View>
        )}

        {deviceData.authorizedDevice.category === "inverter" &&
          deviceData.authorizedDevice.brand.toLowerCase() === "fronius" &&
          (generalData.productionAvailableApi === 2 || generalData.productionAvailableApi === 3) && (
            <View style={styles.badgeContainer}>
              <Badge style={[styles.badge, styles.greenBadge]}>Producción</Badge>
            </View>
          )}
      </View>

      {/* METER */}
      <View style={styles.badgeRow}>
        {deviceData.authorizedDevice.category === "meter" && generalData.consumptionAvailableApi === 6 && (
          <View style={styles.badgeContainer}>
            <Badge style={[styles.badge, styles.orangeBadge]}>Consumo</Badge>
          </View>
        )}

        {deviceData.authorizedDevice.category === "meter" && generalData.productionAvailableApi === 5 && (
          <View style={styles.badgeContainer}>
            <Badge style={[styles.badge, styles.greenBadge]}>Producción</Badge>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  badgeContainer: {
    marginTop: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  orangeBadge: {
    backgroundColor: "orange",
  },
  greenBadge: {
    backgroundColor: "green",
  },
});

export default ConsumProductBadges;
