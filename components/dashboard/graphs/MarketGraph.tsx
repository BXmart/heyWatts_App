import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import useAuthStore from "@/stores/useAuthStore";
import { getEnergyPricesByPropertyId } from "@/services/dashboard.service";
import { getEnergyCompensationPricesByPropertyId } from "@/services/properties.service";
import { URLS } from "@/utils/constants";
import PriceEnergyGraph from "./components/PriceEnergyGraph";
import ExcessCompensationGraph from "./components/ExcessCompensationGraph";
import { EnergyDayPriceI, OwnerDashboardI } from "@/types/OwnerDashboard";

interface MarketPriceGraphsProps {
  data: OwnerDashboardI;
  energyPrice: EnergyDayPriceI[];
  energyCompPrice: EnergyDayPriceI[];
  currentDate: string;
  handleGraphModeChange: (number: number) => void;
  graphMode: number;
  setCurrentDate: (string: string) => void;
}

const MarketPriceGraphs: React.FC<MarketPriceGraphsProps> = ({ data, energyPrice, energyCompPrice, currentDate, handleGraphModeChange, graphMode, setCurrentDate }) => {
  const [visibleHelp, setVisibleHelp] = useState(false);
  const [energyPriceState, setEnergyPriceState] = useState(energyPrice);
  const [energyCompPriceState, setEnergyCompPriceState] = useState(energyCompPrice);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const hasBattery = data?.deviceDashboard?.batteries !== 0;
  const hasInverter = data?.deviceDashboard?.inverterHuawei !== 0 || data?.deviceDashboard?.inverterFronius !== 0;

  const getDate = () => {
    if (currentDate > moment().format("YYYY-MM-DD")) {
      return "hoy";
    }
    return currentDate === moment().format("YYYY-MM-DD") ? "hoy" : currentDate;
  };

  const handleOnChange = (number: number) => {
    handleGraphModeChange(number);
  };

  const handleClickToday = () => {
    setCurrentDate(moment().format("YYYY-MM-DD"));
  };

  useEffect(() => {
    const fetchEnergyPrices = async () => {
      const data = await getEnergyPricesByPropertyId(user?.user.propertyByDefault?._id!, moment(new Date(currentDate).setHours(0, 0, 0, 0)).format("YYYY-MM-DD HH:mm:ss"));
      setEnergyPriceState(data);
    };
    if (currentDate <= moment().format("YYYY-MM-DD")) {
      fetchEnergyPrices();
    }
  }, [currentDate]);

  useEffect(() => {
    const fetchEnergyCompPrices = async () => {
      const data = await getEnergyCompensationPricesByPropertyId(user?.user.propertyByDefault?._id!, moment(new Date(currentDate).setHours(0, 0, 0, 0)).format("YYYY-MM-DD HH:mm:ss"));
      setEnergyCompPriceState(data);
    };
    if (currentDate <= moment().format("YYYY-MM-DD")) {
      fetchEnergyCompPrices();
    }
  }, [currentDate]);

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.helpIcon} onPress={() => setVisibleHelp(!visibleHelp)}>
        <Ionicons name="help-circle-outline" size={24} color={visibleHelp ? "#10B981" : "#9CA3AF"} />
      </TouchableOpacity>
      {visibleHelp && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>Los datos mostrados son el resultado del mercado diario ajustados a tu tarifa en €/kWh.</Text>
        </View>
      )}
      <View>
        <Text style={styles.title}>{graphMode === 0 ? `Precio de la luz de ${getDate()}` : `Comp. Excedentes de ${getDate()}`}</Text>
        {energyPrice.length < 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="stats-chart-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noDataText}>No se han obtenido datos sobre el precio de la luz. Por favor, inténtelo más tarde.</Text>
          </View>
        ) : (
          <>
            {hasInverter && (
              <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tab, graphMode === 0 && styles.activeTab]} onPress={() => handleOnChange(0)}>
                  <Text style={[styles.tabText, graphMode === 0 && styles.activeTabText]}>Precio de la luz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, graphMode === 1 && styles.activeTab]} onPress={() => handleOnChange(1)}>
                  <Text style={[styles.tabText, graphMode === 1 && styles.activeTabText]}>Comp. por excedentes</Text>
                </TouchableOpacity>
              </View>
            )}
            {graphMode === 0 ? <PriceEnergyGraph data={energyPriceState} /> : <ExcessCompensationGraph data={energyCompPriceState} />}
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>¿Has visto el precio de la luz de hoy?</Text> Compruebe los tramos de precio más bajos para optimizar su consumo.
            </Text>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleClickToday} style={styles.button}>
          Ver precios de hoy
        </Button>
        {user?.user.propertyByDefault && (
          <Button mode="contained" onPress={() => navigation.navigate(URLS.APP_OWNER_UNDERSTAND_BILL)} style={styles.button}>
            Entiende tu factura
          </Button>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    minHeight: 460,
  },
  helpIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  popup: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  popupText: {
    fontSize: 12,
    color: "#64748B",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 16,
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 12,
    color: "#64748B",
  },
  activeTabText: {
    color: "white",
  },
  infoText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default MarketPriceGraphs;
