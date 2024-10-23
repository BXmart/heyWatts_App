import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { parseBatteriesDetails } from "./utils/parseBatteriesDetails";
import ConsumptionInfo from "./ConsumptionInfo.component";
import SavingsInfo from "./SavingsInfo.component";
import Badge from "../common/Badge";
import ExpandableContent from "./ExpandableContent.component";
import { Accordion } from "../common/Accordion.component";

const BatteriesProposalContent: React.FC<{ props: Props }> = ({ props }) => {
  const { proposal, noCard } = props;
  const details = parseBatteriesDetails(proposal);
  const [isOpen, setIsOpen] = useState(true);
  const [visibleHelp, setVisibleHelp] = useState(false);

  const InfoSection = () => (
    <View style={styles.infoCard}>
      <ConsumptionInfo label="Coste" details={details} preValue={proposal.preProposalInvoice ?? 0} postValue={proposal.postProposalInvoice ?? 0} unit="€" />

      <ConsumptionInfo label="Consumo" details={details} preValue={proposal.preProposalEnergy ?? 0} postValue={proposal.postProposalEnergy ?? 0} unit="kWh" />

      <SavingsInfo label="Ahorro Estimado" value={details.eurosSaving ?? 0} unit="€" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          <Badge color="green">
            <Text style={styles.badgeText}>Posibilidad de ahorro</Text>
          </Badge>
        </View>

        <View style={styles.headerContainer}>
          <Entypo name="battery" size={28} color="#DBFFE8" />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Optimización de consumo con batería</Text>
          </View>
        </View>

        <View style={styles.batteryCapContainer}>
          <Text style={styles.batteryCapText}>
            Con una batería con capacidad de <Text style={styles.batteryCapValue}>{(details.batteryCap ?? 0) + "kWh"}</Text>
          </Text>
        </View>
        <Accordion title="Mas información">
          <InfoSection />
          <ExpandableContent isOpen={true} details={details} proposal={proposal} />
        </Accordion>
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
    backgroundColor: "#083344", // deepBlue
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
    paddingRight: 100, // Space for badge
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
  helpButton: {
    padding: 4,
  },
  infoSection: {
    marginVertical: 16,
  },
  infoCard: {
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  batteryCapContainer: {
    marginTop: 16,
    paddingBottom: 8,
    borderBottomColor: "#035170", // lightBlue
  },
  batteryCapText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
  },
  batteryCapValue: {
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DBFFE8", // mintGreen
    marginRight: 8,
  },
  expandIcon: {
    color: "#DBFFE8", // mintGreen
  },
  expandIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  expandedContent: {
    marginTop: 16,
  },
});

export default BatteriesProposalContent;
