import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, disabled = false, customStyles = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    if (disabled) return;

    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setIsOpen(!isOpen);

    Animated.timing(rotateAnimation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const arrowRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <ScrollView style={[styles.container, isOpen && styles.containerOpen, customStyles.container]} scrollEnabled={isOpen}>
      <TouchableOpacity
        onPress={toggleAccordion}
        style={[styles.titleContainer, disabled && styles.disabled, isOpen && styles.titleContainerOpen, customStyles.titleContainer]}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, customStyles.title]}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <AntDesign name="up" size={24} color={disabled ? "#035170" : "#DBFFE8"} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && <View style={[styles.contentContainer, customStyles.contentContainer]}>{children}</View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#083344", // deepBlue
    borderRadius: 12,
    marginVertical: 8,
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
  containerOpen: {
    borderColor: "#DBFFE8", // mintGreen
    borderWidth: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#035170", // lightBlue
  },
  titleContainerOpen: {
    borderBottomColor: "#DBFFE8", // mintGreen
    backgroundColor: "#035170", // lightBlue
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#DBFFE8", // mintGreen
    opacity: 0.9,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#083344", // deepBlue
  },
});

export default Accordion;
