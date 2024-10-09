import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { OwnerDashboardI } from "@/types/OwnerDashboard";
import { getOwnerInvoice, InvoiceData } from "@/services/dashboard.service";
import PropertyInfograph from "../PropertyInfograph";
import OwnerDashboardTodayMoneyCard from "./OwnerDashboardTodayMoneyCard";
import OwnerDashboardPredictMoneyCard from "./OwnerDashboardPredictMoneyCard";
import OwnerDashboardTopEnergyConsumedCard from "./OwnerDashboardTopEnergyConsumed";
import OwnerDashboardTopMoneyConsumedCard from "./OwnerDashboardTopMoneyCard";
import { string } from "zod";

const { width } = Dimensions.get("window");

interface TopSwiperCardsProps {
  data: OwnerDashboardI;
  hasMeterDevices: boolean;
}

const TopSwiperCards: React.FC<TopSwiperCardsProps> = ({ data, hasMeterDevices }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const [visibleHelp, setVisibleHelp] = useState({ isOpen: false, data: null as "prediction" | "actual" | null });
  const [error, setError] = useState(false);

  const hasBattery = data?.deviceDashboard?.batteries !== 0;
  const hasInverter = data?.deviceDashboard?.inverterHuawei !== 0 || data?.deviceDashboard?.inverterFronius !== 0;

  const fetch = async () => {
    try {
      const response = await getOwnerInvoice(data?.property?._id);
      setInvoiceData(response);
    } catch (error) {
      setError(true);
    }
  };

  const handleChangeModal = (boolean: boolean, data: "prediction" | "actual") => {
    setVisibleHelp({ isOpen: boolean, data });
  };

  const otherCosts = (data?: InvoiceData) => {
    if (!data) return 0;
    const totalCost = data?.[visibleHelp.data ?? "actual"]?.totalCost;
    const energyTermCost = data?.[visibleHelp.data ?? "actual"]?.energyTermCost;
    const powerTermCost = data?.[visibleHelp.data ?? "actual"]?.powerTermCost;
    const costPenalty = data?.[visibleHelp.data ?? "actual"]?.costPenalty;

    return totalCost - energyTermCost - powerTermCost - costPenalty;
  };

  useEffect(() => {
    fetch();
  }, []);

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Información</Text>
      <View style={styles.modalGrid}>
        {/* Left column */}
        <View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{invoiceData?.[visibleHelp.data ?? "actual"]?.powerTermCost?.toFixed(2) || "0.00"}€</Text>
            <Text style={styles.modalLabel}>Término Potencia</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{invoiceData?.[visibleHelp.data ?? "actual"]?.energyTermCost?.toFixed(2) || "0.00"}€</Text>
            <Text style={styles.modalLabel}>Término Energía</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{invoiceData?.[visibleHelp.data ?? "actual"]?.costPenalty?.toFixed(2) || "0.00"}€</Text>
            <Text style={styles.modalLabel}>Penalización</Text>
          </View>
        </View>
        {/* Right column */}
        <View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{invoiceData?.[visibleHelp.data ?? "actual"]?.energyConsumed?.toFixed(2) || "0.00"} kWh</Text>
            <Text style={styles.modalLabel}>Energía Consumida</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{invoiceData?.[visibleHelp.data ?? "actual"]?.energySurplus?.toFixed(2) || "0.00"} kWh</Text>
            <Text style={styles.modalLabel}>Energía Volcada</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>{otherCosts(invoiceData)?.toFixed(2) || "0.00"}€</Text>
            <Text style={styles.modalLabel}>Otros costes*</Text>
          </View>
        </View>
      </View>
      <Text style={styles.modalFootnote}>
        {visibleHelp?.data === "actual"
          ? "*Incluimos todos los impuestos y costes adicionales basados en la tarifa que tienes. Si no tenemos tu tarifa, usamos un promedio. Para que nuestros cálculos sean más precisos, sería ideal que nos envíes tu CUPS y tus facturas."
          : "*Incluimos todos los impuestos y costes adicionales basados en los datos de tu tarifa. Si no tenemos detalles de tu tarifa, utilizamos un promedio. En caso de tarifas indexadas, hacemos estimaciones según los precios de mercado, pero ten en cuenta que pueden variar respecto a los resultados finales."}
      </Text>
    </View>
  );

  if (error) {
    return (
      <Card style={styles.errorCard}>
        <Text style={styles.errorTitle}>Estadisticas</Text>
        <Text style={styles.errorMessage}>No tenemos datos de Datadis o de histórico de consumo, ni el usuario tiene introducido un promedio de consumo en sus datos de propiedad</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Modal isVisible={visibleHelp.isOpen} onBackdropPress={() => setVisibleHelp({ isOpen: false, data: null })} style={styles.modal}>
        {renderModalContent()}
      </Modal>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        {/*  {(hasMeterDevices || hasBattery || hasInverter) && (
          <View style={styles.slide}>
            <PropertyInfograph data={data} hasBattery={hasBattery} hasInverter={hasInverter} />
          </View>
        )} */}
        <View style={styles.slide}>
          <OwnerDashboardTodayMoneyCard invoiceData={invoiceData} openModal={handleChangeModal} />
        </View>
        <View style={styles.slide}>
          <OwnerDashboardPredictMoneyCard invoiceData={invoiceData} openModal={handleChangeModal} />
        </View>

        {invoiceData && (
          <View style={styles.slide}>
            <OwnerDashboardTopEnergyConsumedCard invoiceData={invoiceData} />
          </View>
        )}
        {invoiceData && (
          <View style={styles.slide}>
            <OwnerDashboardTopMoneyConsumedCard invoiceData={invoiceData} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
  },
  slide: {
    width: "auto",
    maxWidth: width / 2,
    paddingHorizontal: 5,
    backgroundColor: "transparent",
  },
  errorCard: {
    height: 140,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
    marginTop: 8,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxWidth: 450,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 16,
  },
  modalGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  modalRow: {
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  modalLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  modalFootnote: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default TopSwiperCards;
