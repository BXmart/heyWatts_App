import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ConsumProductBadges from './ConsumProductBadges.component';

const InverterTopCard = ({ props }) => {
  const { deviceData, authdev, generalData } = props;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.deviceName}>{deviceData.name}</Text>
          <Text style={styles.authDevName}>{authdev.name}</Text>
        </View>
        <Image source={{ uri: authdev.img }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Estado</Text>
        <ConsumProductBadges props={{ deviceData, generalData }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F202D',
    padding: 12,
    borderRadius: 15,
    gap: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  authDevName: {
    color: '#6A8CA1',
    fontSize: 14,
  },
  statusContainer: {
    gap: 4,
  },
  label: {
    color: '#6A8CA1',
    fontSize: 14,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginLeft: 12,
  },
});

export default InverterTopCard;
