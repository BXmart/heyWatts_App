import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

// Types
interface PowerTableItem {
  tariff: string;
  powerBefore: number;
  powerAfter: number;
}

interface PowersDetail {
  subproposal: number;
}

interface PowersTableProps {
  data: PowerTableItem[];
  details: PowersDetail;
}

const PowersTable: React.FC<PowersTableProps> = ({ data, details }) => {
  // Header component
  const TableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.columnFirst]}>Tramo</Text>
      <Text style={[styles.headerText, styles.columnMiddle]}>Potencia actual</Text>
      {details.subproposal !== 0 && <Text style={[styles.headerText, styles.columnLast]}>A cambiar por</Text>}
    </View>
  );

  // Row component
  const TableRow = ({ item, index }: { item: PowerTableItem; index: number }) => (
    <View style={[styles.row, index === data.length - 1 ? null : styles.borderBottom]}>
      <Text style={[styles.cellText, styles.columnFirst]}>{item.tariff}</Text>

      <View style={[styles.columnMiddle, styles.valueContainer]}>
        <Text style={styles.cellText}>{item.powerBefore.toFixed(2)}</Text>
        <Text style={styles.unitText}> kW</Text>
      </View>

      {details.subproposal !== 0 && (
        <View style={[styles.columnLast, styles.valueContainer]}>
          <Text style={styles.newPowerText}>{item.powerAfter.toFixed(2)}</Text>
          <Text style={[styles.unitText, styles.newPowerUnit]}> kW</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TableHeader />
      <FlatList
        data={data}
        renderItem={({ item, index }) => <TableRow item={item} index={index} />}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
    backgroundColor: "#083344", // deepBlue
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#035170", // lightBlue
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#035170", // lightBlue
    borderBottomWidth: 1,
    borderBottomColor: "#083344", // deepBlue
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#083344", // deepBlue
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#035170", // lightBlue
  },
  separator: {
    height: 1,
    backgroundColor: "#035170", // lightBlue
  },
  cellText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DBFFE8", // mintGreen
    opacity: 0.8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  unitText: {
    fontSize: 12,
    color: "#DBFFE8", // mintGreen
    opacity: 0.7,
  },
  newPowerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
  },
  newPowerUnit: {
    color: "#DBFFE8", // mintGreen
    opacity: 0.8,
  },
  columnFirst: {
    flex: 1,
  },
  columnMiddle: {
    flex: 1,
  },
  columnLast: {
    flex: 1,
  },
});

export default PowersTable;
