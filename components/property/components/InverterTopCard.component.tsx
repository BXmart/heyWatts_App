import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ConsumProductBadges from "./ConsumProductBadges.component";

const InverterTopCard = ({ props }) => {
  const { deviceData, authdev, generalData } = props;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.deviceName}>{deviceData.name}</Text>
        <Text style={styles.authDevName}>{authdev.name}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.label}>Estado</Text>
            <ConsumProductBadges props={{ deviceData, generalData }} />
          </View>
          {/* Commented out power section
          <View style={styles.powerContainer}>
            <Text style={styles.label}>Potencia</Text>
            <View style={styles.powerValueContainer}>
              <Text style={styles.powerValue}>
                {data01Value < 0 ? Math.abs(data01Value) : data01Value}
                <Text style={styles.powerUnit}>w</Text>
              </Text>
              {data06Value && <IconPowerThunder style={styles.powerIcon} />}
            </View>
          </View>
          */}
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: authdev.img }} style={styles.image} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F202D",
    padding: 15,
  },
  deviceName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  authDevName: {
    color: "#6A8CA1",
    fontSize: 14,
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  infoContainer: {
    flex: 1,
  },
  statusContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#6A8CA1",
    fontSize: 14,
    marginBottom: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default InverterTopCard;
