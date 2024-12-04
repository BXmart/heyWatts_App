import React, { useEffect, useState } from 'react';
import { useFetchExternalCommunications } from '../hooks/useFetchDevices';
import { DeviceI } from '@/types/Device';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import InverterCard from './InverterCard.component';
import { ScrollView } from 'react-native-gesture-handler';

const DevicesList = ({ propertyDetails }: { propertyDetails: any }) => {
  const [devices, setDevices] = useState<DeviceI[]>();

  const { data } = useFetchExternalCommunications();

  useEffect(() => {
    if (propertyDetails) {
      setDevices(propertyDetails.devices.sort((a: any, b: any) => a.priority - b.priority));
    }
  }, [propertyDetails, data]);

  return (
    <ScrollView>
      {!!devices &&
        devices.length > 0 &&
        devices.slice().find((item) => item.authorizedDevice.category === 'inverter' || item.authorizedDevice.category === 'gateway' || item.authorizedDevice.category === 'meter') && (
          <Text style={{ color: '#DBFFE8', fontSize: 18, fontWeight: 'bold' }}>Dispositivos de lectura</Text>
        )}

      {!!devices &&
        devices.length > 0 &&
        devices
          .slice()
          .filter((item) => item.authorizedDevice.category === 'inverter' || item.authorizedDevice.category === 'gateway' || item.authorizedDevice.category === 'meter')
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((device) => {
            if (device.authorizedDevice.category === 'inverter') {
              return <InverterCard key={device._id} data={device} generalData={data} />;
            }
            /*  if (device.authorizedDevice.category === 'gateway') {
                return <GatewayCard key={device._id} device={device} generalData={data} unknownInstaller={unknownInstaller} externalCom={externalCom} reloadData={reloadData} />;
              }
              if (device.authorizedDevice.category === 'meter') {
                return <GatewayCard key={device._id} device={device} generalData={data} unknownInstaller={unknownInstaller} externalCom={externalCom} reloadData={reloadData} />;
              }
              return (
                <FlipCard
                  key={device._id}
                  front={<CardsContent generalData={data} data={device} key={device._id} />}
                  back={<BackCardContent data={device} unknownInstaller={unknownInstaller} externalCom={externalCom} />}
                />
              ); */
          })}
    </ScrollView>
  );
};

export default DevicesList;
