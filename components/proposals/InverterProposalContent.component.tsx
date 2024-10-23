import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ConsumptionInfo from "./ConsumptionInfo.component";
import SavingsInfo from "./SavingsInfo.component";
import Badge from "../common/Badge";
import ExpandableContent from "./ExpandableContent.component";
import { Accordion } from "../common/Accordion.component";
import { parseInverterDetails } from "./utils/parseInverterDetails";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HelpModal } from "../common/HelpModal.component";

interface Props {
  proposal: any;
  noCard?: boolean;
}

const InvertersImprovementContent: React.FC<{ props: Props }> = ({ props }) => {
  const { proposal } = props;
  const details = parseInverterDetails(proposal);
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
      <HelpModal
        visible={visibleHelp}
        onClose={() => setVisibleHelp(false)}
        text={"Estimación calculada en base a la media de consumo, superficie, inclinación y orientación almacenadas por el usuario."}
      />
      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          <Badge color="green">
            <Text style={styles.badgeText}>Posibilidad de ahorro</Text>
          </Badge>
        </View>

        <View style={styles.headerContainer}>
          <MaterialIcons name="solar-power" size={28} color="#DBFFE8" />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Optimización de consumo con fotovoltaica</Text>
            <TouchableOpacity onPress={() => setVisibleHelp(!visibleHelp)} style={styles.helpButton}>
              <Feather name="help-circle" size={20} color={visibleHelp ? "#DBFFE8" : "#035170"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inverterInfoContainer}>
          <Text style={styles.inverterInfoText}>
            Con un inversor de <Text style={styles.highlightText}>{(details.picPowInv ?? 0) + "kWp"}</Text> y <Text style={styles.highlightText}>{(details.numPanels ?? 0) + " panel/es"}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
    flex: 1,
  },
  helpButton: {
    padding: 4,
  },
  infoCard: {
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  inverterInfoContainer: {
    marginTop: 16,
    paddingBottom: 8,
    borderBottomColor: "#035170", // lightBlue
  },
  inverterInfoText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
  },
  highlightText: {
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  helpPopup: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#035170", // lightBlue
    padding: 16,
    borderRadius: 8,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helpPopupText: {
    color: "#DBFFE8", // mintGreen
    fontSize: 14,
    lineHeight: 20,
  },
});

export default InvertersImprovementContent;
