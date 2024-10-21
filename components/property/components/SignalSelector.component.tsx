import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const SignalSelector = ({ availableSignals, setSelectedSignals, lineColors, selectedSignals }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedSignals);

  const handleToggle = (signal: string) => {
    if (tempSelected.includes(signal)) {
      setTempSelected(tempSelected.filter((item: any) => item !== signal));
    } else {
      setTempSelected([...tempSelected, signal]);
    }
  };

  useEffect(() => {
    setSelectedSignals(tempSelected);
  }, [tempSelected]);

  const Item = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity style={styles.signalItem} onPress={() => handleToggle(item.value)}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Checkbox color="" value={tempSelected.includes(item.value)} onTouchEnd={() => handleToggle(item.value)} />
          <Text style={{ width: "auto", color: "white" }}>{item.label}</Text>
        </View>
        <View style={{ backgroundColor: lineColors[index] ?? "black", width: 15, height: 15, borderRadius: 8, marginRight: 10 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.modalTitle}>Señales</Text>
      <View>
        {availableSignals &&
          availableSignals.map((item: any, index: number) => (
            <TouchableOpacity key={index} style={styles.signalItem} onPress={() => handleToggle(item.value)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Checkbox color="" value={tempSelected.includes(item.value)} onTouchEnd={() => handleToggle(item.value)} />
                <Text style={{ width: "auto", color: "white" }}>{item.label}</Text>
              </View>
              <View style={{ backgroundColor: lineColors[index] ?? "black", width: 15, height: 15, borderRadius: 8, marginRight: 10 }} />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#035170",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  flatList: {
    maxHeight: 300,
  },
  signalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  saveButton: {
    backgroundColor: "#035170",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignalSelector;
