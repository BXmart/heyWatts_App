import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Checkbox } from "expo-checkbox";

const SignalSelectorModal = ({ availableSignals, setSelectedSignals }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState([]);

  const handleToggle = (signal) => {
    setTempSelected((prev) => (prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal]));
  };

  const handleSave = () => {
    setSelectedSignals(tempSelected);
    setIsVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setIsVisible(true)}>
        <Text style={styles.buttonText}>Select Signals</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={() => setIsVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Signals</Text>
            <ScrollView style={styles.scrollView}>
              {availableSignals.map((signal) => (
                <View key={signal.value} style={styles.checkboxContainer}>
                  <Checkbox value={tempSelected.includes(signal.value)} onValueChange={() => handleToggle(signal.value)} color={tempSelected.includes(signal.value) ? "#4630EB" : undefined} />
                  <Text style={styles.label}>{signal.label}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setIsVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4630EB",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollView: {
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonSave: {
    backgroundColor: "#4630EB",
  },
});

export default SignalSelectorModal;
