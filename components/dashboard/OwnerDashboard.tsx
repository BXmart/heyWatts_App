import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useOwnerDashboard } from "@/components/dashboard/hooks/useOwnerHook";
import { getDashboardConsumptionAndPredictionGraph } from "@/services/dashboard.service";
import DashboardGraph from "./graphs/DashboardGraph";
import moment from "moment";
import useAuthStore from "@/stores/useAuthStore";

const OwnerDashboard = () => {
  const navigation = useNavigation();
  const { logout, userInfo } = useAuthStore(); // Assume this custom hook exists
  const [dashboardData, setDashboardData] = useState<any>();
  /* const [openDeviceModal, setOpenDeviceModal] = useState(false); */

  const { data: refreshData } = useOwnerDashboard();

  /* if (userInfo.propertyByDefault === null) {
    return <NoPropertyModal />;
  } */

  useEffect(() => {
    const getData = async () => {
      Promise.all([
        /* data.ownerDashboardPromise,
        data.propertyDetailsPromise,
        data.energyPricesPromise,
        data.userPropertiesPromise, */
        getDashboardConsumptionAndPredictionGraph({
          propertyId: userInfo!.user.propertyByDefault!._id!,
          date: moment(new Date().setHours(0, 0, 0, 0)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        }),
        /* data.proposalPromise, */
      ])
        .then((values) => {
          if (values[0]) {
            setDashboardData(values[0]);
          }
        })
        .catch((error) => {
          console.log({ error });
        });
    };

    if (userInfo) {
      getData();
    }
  }, [userInfo]);

  /*   const [currentProperty, setCurrentProperty] = useState(
    userInfo!.propertyByDefault?._id ?? undefined
  ); */
  /*  const feeType = getFeeTypeName(propertyDetails.contracts[0]?.feeType);
  const energySlots = analyzeEnergyPrices(energyPrice);
  const compSlots = analyzeCompPrices(energyCompPrice);
  const hasInverter = !!propertyDetails?.devices.find((item) => item?.authorizedDevice?.category === 'inverter') || false;
  const hasMeterDevices = propertyDetails.devices.some(
    (device) => device.authorizedDevice?.deviceType === "shellyEM_meter"
  );  
   */

  /*  if (ownerDashboardData === null) {
    return <NoPropertyModal />;
  }

  if (propertyDetails.consumptionAvailableApi === 4) {
    return <DatadisDashboard props={{ userInfo, currentProperty, propertyDetails, userProperties, setCurrentProperty, refreshData, data: ownerDashboardData, energyPrice, energyCompPrice }} />;
  } */

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  if (!userInfo) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, paddingTop: 0, paddingLeft: 15, paddingRight: 15 }}
      >
        <Text style={{ fontSize: 12, color: "#64748B" }}>Panel de control</Text>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido, {userInfo.user.name}</Text>
          {/* <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="black" />
          </TouchableOpacity> */}
        </View>

        {/*  <Card style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Revenue</Text>
        </Card> */}

        {/*  <DashboardHeader props={{ currentProperty, propertyDetails, userProperties, setCurrentProperty, energyCompPrice }} /> */}
        {/* <TopSwiperCards data={refreshData || ownerDashboardData} hasMeterDevices={hasMeterDevices}/>
      <ImprovementCards data={proposalPromise} onChangeDeviceModal={() => setOpenDeviceModal(true)} /> */}

        {/* <Text>Resumen de propiedad</Text> */}
        <View style={{ flexDirection: "column", gap: 20 }}>
          <DashboardGraph data={dashboardData} />

          {/* {(feeType == 'PVPC (Regulada)' || feeType == 'indexada') && (
          <AdvicePrice slots={energySlots} data_id={propertyDetails._id} hasDevices={!!propertyDetails.devices}/>
        )}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ flex: 1 }}>
            {(feeType == 'PVPC (Regulada)' || feeType == 'indexada') && hasInverter && (
              <AdvicePrice compensation slots={compSlots} data_id={propertyDetails._id} hasDevices={!!propertyDetails.devices}/>
            )}
          </View>
          <AdvicesPanel data={{ propertyDetails, energyPrice, currentProperty }} />
        </View>   */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    margin: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  actionButton: {
    alignItems: "center",
  },
});

export default OwnerDashboard;

/* <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginVertical: 16,
          }}
        >
          <Button
            title="Añadir propiedad"
            onPress={() => null}
            onPress={() => navigation.navigate(URLS.APP_TOUR)}
            ></Button>
            <Button
              title="Añadir dispositivo"
              onPress={() => null}
              onPress={() =>
                navigation.navigate(
                  `/app/my-properties/${currentProperty}/new-device`
                )
              }
            ></Button>
            <Button
              title="Ver facturas"
              onPress={() => null}
              onPress={() =>
                navigation.navigate(
                  `/app/my-properties/${currentProperty}/invoices`
                )
              }
            ></Button>
            <Button
              title="Ver propiedad"
              onPress={() => null}
              onPress={() =>
                navigation.navigate(
                  URLS.APP_OWNER_PROPERTIES + "/" + currentProperty
                )
              }
            ></Button>
            <Button
              title="Ajustes"
              onPress={() => null}
            onPress={() =>
                navigation.navigate(`/app/my-properties/${currentProperty}/edit`)
              }
            ></Button>
          </View> */
