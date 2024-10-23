import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import ConsumptionInfo from "./ConsumptionInfo.component";
import SavingsInfo from "./SavingsInfo.component";
import Badge from "../common/Badge";
import { Accordion } from "../common/Accordion.component";
import { FEETYPES_LIST } from "@/utils/feeTypes";
import FeeDetails from "./FeeDetails.component";
import ComparisonFee from "./ComparisonFee.component";
import { parseFeesDetails } from "./utils/parseFeeDetails";

interface FeeProps {
  proposal: any;
  noCard?: boolean;
}

const FeesImprovementContent: React.FC<{ props: FeeProps }> = ({ props }) => {
  const { proposal, noCard } = props;
  const details = parseFeesDetails(proposal);
  const [showComparison, setShowComparison] = useState(false);

  const ComparisonModal = () => (
    <Modal visible={showComparison} transparent={true} animationType="fade" onRequestClose={() => setShowComparison(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowComparison(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{details.eurosSaving > 0 ? "Visualizar comparación" : "Datos de otro tipo de tarifa"}</Text>
          <ScrollView>
            <ComparisonFee details={details} isWorseThanCurrentTarif={details.eurosSaving <= 0} />
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ComparisonModal />

      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          <Badge color="green">
            <Text style={styles.badgeText}>Posibilidad de ahorro</Text>
          </Badge>
        </View>

        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={28} color="#DBFFE8" />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{details.eurosSaving > 0 ? "Cambie de tarifa para ahorrar" : "Su tarifa es la óptima actualmente"}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.costsContainer}>
            <ConsumptionInfo label="Coste" details={details} preValue={details.costOpt ?? 0} unit="€" />
            <SavingsInfo label="Resultado" value={details.costNoOpt ?? 0} unit="€" />
          </View>

          <Text style={styles.descriptionText}>
            Tu tarifa de distribución es <Text style={styles.highlightText}>{details.codeFare ? details.codeFare : "desconocida"}</Text>. Viendo tus consumos, te interesa{" "}
            {details.eurosSaving > 0 ? "una tarifa comercial" : "mantener tu tarifa actual"} de tipo{" "}
            <Text style={styles.highlightText}>{details.feeTypeOpt ? FEETYPES_LIST.find((item) => item.id === details.feeTypeOpt)?.description : "desconocida"}</Text> en base a los siguientes precios
            promedio de tarifas comerciales
          </Text>
        </View>

        <Accordion title="Detalles de tarifa">
          <FeeDetails details={details} isOpt />
        </Accordion>

        <TouchableOpacity style={styles.comparisonButton} onPress={() => setShowComparison(true)}>
          <Text style={styles.comparisonButtonText}>{details.eurosSaving > 0 ? "Visualizar comparación" : "Datos de otro tipo de tarifa"}</Text>
        </TouchableOpacity>

        <Link href={`${URLS.APP_OWNER_PROPERTIES}/${proposal.property._id}/new-device`} asChild>
          <TouchableOpacity style={styles.addDeviceButton}>
            <Text style={styles.buttonText}>Añadir dispositivo</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#083344", // deepBlue
    borderRadius: 12,
    margin: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  badgeText: {
    color: "#DBFFE8", // mintGreen
    fontSize: 12,
    fontWeight: "500",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingRight: 100,
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  infoSection: {
    marginVertical: 16,
  },
  costsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  comparisonButton: {
    backgroundColor: "#035170", // lightBlue
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  comparisonButtonText: {
    color: "#DBFFE8", // mintGreen
    fontWeight: "500",
    fontSize: 14,
  },
  addDeviceButton: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#DBFFE8", // mintGreen
    fontWeight: "500",
    fontSize: 16,
  },
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
});

export default FeesImprovementContent;
