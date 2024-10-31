import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import InverterTopCard from './InverterTopCard.component';
import { useDevice } from '../hooks/useDevice';

const InverterCard = ({ data: device, generalData }) => {
  const { deviceData, isLoading } = useDevice(device);
  const authdev = deviceData.authorizedDevice;
  const data01 = deviceData.attributes.find((item) => item.code === 'DATA01');
  const data03 = deviceData.attributes.find((item) => item.code === 'DATA03');
  const data06 = deviceData.attributes.find((item) => item.code === 'DATA06');
  const data14 = deviceData.attributes.find((item) => item.code === 'DATA14');

  const data01Value = !!data01 && !isNaN(+data01.value) ? +data01.value : 0;
  const data06Value =
    !!data06 && (data06.value.toLowerCase() === 'on' || data06.value.toLowerCase() === 'charge' ? true : data06.value.toLowerCase() === 'off' || data06.value.toLowerCase() === 'stop' ? false : false);
  const data14Value = !!data14 && +data14.value;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Actualizando dispositivo, espere...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InverterTopCard props={{ deviceData, authdev, data01Value, data06Value, data14Value, data03, generalData }} />
      {deviceData.machineStatus.toLowerCase() === 'offline' && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>Comprobar conectividad...</Text>
        </View>
      )}
      <View style={[styles.detailsContainer, deviceData.machineStatus.toLowerCase() === 'offline' && styles.offlineDetails]}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Marca</Text>
            <Text style={styles.detailValue}>{deviceData.authorizedDevice.brand ?? '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Modelo</Text>
            <Text style={styles.detailValue}>{deviceData.authorizedDevice.model ?? '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Potencia máxima de producción</Text>
            <Text style={styles.detailValue}>
              {Math.abs(deviceData.maxDevicePower) / 1000} <Text style={styles.unitText}>kW</Text>
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nº de serie</Text>
            <Text style={styles.detailValue}>{deviceData.serialNumber ?? '-'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#173440',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  loadingContainer: {
    backgroundColor: '#035170',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 14,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  authDevName: {
    color: '#4A6F85',
    fontSize: 14,
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoContainer: {
    flex: 1,
  },
  statusContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#4A6F85',
    fontSize: 14,
    marginBottom: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  offlineDetails: {
    opacity: 0.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8, // Compensate for detailItem padding
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    color: '#7eabbf',
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '500',
  },
  unitText: {
    color: '#4A6F85',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(74, 111, 133, 0.2)',
  },
  offlineContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default InverterCard;
