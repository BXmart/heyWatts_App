import React from "react";
import { Modal, Text, View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  text: string;
  title?: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose, text, title }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Fixed: pass function directly
      onTouchEnd={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose} // Fixed: pass function directly
        />
        <View style={styles.contentWrapper}>
          <View style={[styles.modalContent, Platform.OS === "ios" ? styles.modalContentIOS : styles.modalContentAndroid]}>
            {title && <Text style={styles.modalTitle}>{title}</Text>}
            <Text style={styles.modalText}>{text}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: "#083344", // deepBlue
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#035170", // lightBlue
  },
  // Platform specific shadows
  modalContentIOS: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  modalContentAndroid: {
    elevation: 8,
  },
  modalTitle: {
    color: "#DBFFE8", // mintGreen
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    color: "#DBFFE8", // mintGreen
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default HelpModal;
