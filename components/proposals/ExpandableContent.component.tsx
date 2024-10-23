import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { SavingsInfo } from "./SavingsInfo.component";
import PowersTable from "./PowersTable.component";
import RoiDataCard from "./RoiDataCard.component";

// Types
interface Details {
  energySurplus?: number;
  eurosSurplus?: number;
}

interface Proposal {
  category: string;
}

interface PowersData {
  data: any;
  increasePowerArray: any[];
}

interface ExpandableContentProps {
  isOpen: boolean;
  details: Details;
  proposal: Proposal;
  powersData?: PowersData | null;
}

export const ExpandableContent: React.FC<ExpandableContentProps> = ({ isOpen, details, proposal, powersData }) => {
  const [contentHeight] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(contentHeight, {
      toValue: isOpen ? 500 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          maxHeight: contentHeight,
          opacity: contentHeight.interpolate({
            inputRange: [0, 500],
            outputRange: [0, 1],
          }),
        },
      ]}
    >
      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        {!!details.energySurplus && (
          <View style={styles.infoCard}>
            <SavingsInfo label="Energía Vertida" value={details.energySurplus} unit="kW" />
          </View>
        )}

        {!!details.eurosSurplus && (
          <View style={styles.infoCard}>
            <SavingsInfo label="Importe por vertidos" value={details.eurosSurplus} unit="€" />
          </View>
        )}

        {details && powersData && proposal.category === "powers" && (
          <View style={styles.powersContainer}>
            <PowersTable data={powersData.increasePowerArray} details={details} />
          </View>
        )}

        <View style={styles.roiContainer}>
          <RoiDataCard data={details} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#083344", // deepBlue
  },
  divider: {
    height: 1,
    backgroundColor: "#035170", // lightBlue
    width: "100%",
    marginVertical: 8,
  },
  contentContainer: {
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  infoCard: {
    flex: 1,
    minWidth: "45%", // Allows 2 cards per row with gap
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  powersContainer: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  powersTable: {
    width: "100%",
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 12,
  },
  roiContainer: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roiCard: {
    backgroundColor: "#035170", // lightBlue
    borderRadius: 8,
    padding: 12,
  },
});

export default ExpandableContent;
