import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { ExpandableContent } from "./ExpandableContent.component";
import { Accordion } from "../common/Accordion.component";
import { getPowersToChangeInTwoArrays } from "@/utils/powers/getPowersToChangeInTwoArrays";
import { setData } from "@/utils/powers/setData";

import Badge from "../common/Badge";
import PowersTable from "./PowersTable.component";
import { parsePowersDetails } from "./utils/parsePowersDetails";
import { getPowersToChange } from "@/utils/powers/getPowersToChange";
import { HelpModal } from "../common/HelpModal.component";

interface PowersProps {
  proposal: any;
}

const PowersImprovementContent: React.FC<{ props: PowersProps }> = ({ props }) => {
  const { proposal } = props;
  const details = parsePowersDetails(proposal);
  const [visibleHelp, setVisibleHelp] = useState(false);
  const data = setData(details.subproposal, details);

  // Process power arrays
  let increasePowerArray, decreasePowerArray;
  if (details.subproposal === 3) {
    const result = getPowersToChangeInTwoArrays(details.actualPows, details.recommendedPowers);
    increasePowerArray = result[0];
    decreasePowerArray = result[1];
  } else {
    increasePowerArray = getPowersToChange(details.actualPows, details.recommendedPowers);
  }

  return (
    <View style={styles.container}>
      <HelpModal visible={visibleHelp} onClose={() => setVisibleHelp(false)} text="Consulta a tu distribuidora en base al año completo." />

      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          <Badge color={data.color}>
            <Text style={styles.badgeText}>{data.badgeText}</Text>
          </Badge>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="flash" size={28} color="#DBFFE8" />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{data.title}</Text>
            <TouchableOpacity onPress={() => setVisibleHelp(true)} style={styles.helpButton}>
              <Feather name="help-circle" size={20} color={visibleHelp ? "#DBFFE8" : "#035170"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.textSection}>
            <Text style={styles.descriptionText}>{data.firstText}</Text>
          </View>

          <View style={styles.dataSection}>
            {!!details.batteries && (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsLabel}>Ahorro Total</Text>
                <Text style={styles.savingsAmount}>
                  {parseFloat(details.batteries.toString()).toFixed(2) ?? 0}
                  <Text style={styles.savingsUnit}>€</Text>
                </Text>
              </View>
            )}

            <Text style={styles.descriptionText}>{data.secondText}</Text>

            {details.subproposal === 0 && <PowersTable data={increasePowerArray} details={details} />}
          </View>
        </View>

        {details.subproposal !== 0 && (
          <Accordion title="Más información">
            <ExpandableContent isOpen={true} details={details} proposal={proposal} powersData={{ data, increasePowerArray, decreasePowerArray }} />
          </Accordion>
        )}

        {/* <View style={styles.footer}>
          <Link href={`${URLS.APP_OWNER_PROPERTIES}/${proposal.property._id}/new-device`} asChild>
            <TouchableOpacity style={styles.addDeviceButton}>
              <Text style={styles.buttonText}>Añadir dispositivo</Text>
            </TouchableOpacity>
          </Link>
        </View> */}
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingRight: 100,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 12,
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
  contentSection: {
    marginTop: 16,
  },
  textSection: {
    marginBottom: 16,
  },
  dataSection: {
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
  savingsContainer: {
    marginBottom: 12,
  },
  savingsLabel: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    opacity: 0.8,
  },
  savingsAmount: {
    fontSize: 28,
    fontWeight: "600",
    color: "#22C55E", // green
  },
  savingsUnit: {
    fontSize: 14,
    marginLeft: 2,
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addDeviceButton: {
    backgroundColor: "#22C55E", // green
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
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
    borderWidth: 1,
    borderColor: "#035170", // lightBlue
  },
  modalText: {
    color: "#DBFFE8", // mintGreen
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PowersImprovementContent;
