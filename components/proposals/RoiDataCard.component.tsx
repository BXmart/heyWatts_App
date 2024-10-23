import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const RoiDataCard: React.FC<Props> = ({ data, style }) => {
  const [showHelp, setShowHelp] = useState(false);
  const { paybackYears, paybackMonths, ROI } = data;

  const RoiHelpModal = () => (
    <Modal visible={showHelp} transparent={true} animationType="fade" onRequestClose={() => setShowHelp(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowHelp(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Qué es el ROI?</Text>
          <ScrollView>
            <Text style={styles.modalText}>
              El ROI mide el porcentaje de tu inversión recuperado anualmente. Un ROI positivo indica ganancias, mientras que uno negativo sugiere que la inversión no se recuperará.
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Por ejemplo </Text>
              Una inversión de 10,000 € con un ahorro de 1,500 € al año tiene un ROI del 15% (has recuperado el 15% de tu inversión inicial en un año).
            </Text>
            <Text style={styles.modalText}>Un ROI negativo significa que la inversión no se recuperará nunca y, por lo tanto, no es rentable*.</Text>
            <Text style={styles.disclaimerText}>(*) Esto puede deberse a que el tiempo para recuperar la inversión supera la vida útil de los equipos involucrados.</Text>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, style]}>
      <RoiHelpModal />

      <View style={styles.paybackSection}>
        <Text style={styles.sectionLabel}>Tiempo en retornar inversión</Text>
        <View style={styles.paybackValues}>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{paybackYears ?? 0}</Text>
            <Text style={styles.unit}>años</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{paybackMonths ?? 0}</Text>
            <Text style={styles.unit}>meses</Text>
          </View>
        </View>
      </View>

      <View style={styles.roiSection}>
        <View style={styles.roiHeader}>
          <Text style={styles.sectionLabel}>Retorno en inversión (ROI %)</Text>
          <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.helpButton}>
            <Feather name="info" size={20} color={showHelp ? "#DBFFE8" : "#035170"} />
          </TouchableOpacity>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: ROI && parseFloat(ROI.toString()) >= 0 ? "#DBFFE8" : "#EF4444" }]}>{ROI ?? 0}</Text>
          <Text style={[styles.unit, { color: ROI && parseFloat(ROI.toString()) >= 0 ? "#DBFFE8" : "#EF4444" }]}>%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#035170", // lightBlue
  },
  paybackSection: {
    marginBottom: 16,
  },
  roiSection: {
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#DBFFE8", // mintGreen
    marginBottom: 8,
    opacity: 0.9,
  },
  paybackValues: {
    flexDirection: "row",
    gap: 16,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  unit: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    opacity: 0.8,
  },
  roiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helpButton: {
    padding: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#083344", // deepBlue
    borderRadius: 12,
    padding: 16,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#035170", // lightBlue
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
  },
  boldText: {
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  disclaimerText: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    fontStyle: "italic",
    marginTop: 8,
    opacity: 0.7,
  },
});

export default RoiDataCard;
