import { Text, View, StyleSheet } from "react-native";

export interface LabelProps {
  text: string;
  color?: string;
  fontSize?: number;
  rotationDegree?: number;
}

const createLabelComponent =
  ({ text, color = "gray", fontSize = 10, rotationDegree = 0 }: LabelProps) =>
  () =>
    (
      <View
        style={[
          styles.labelContainer,
          { transform: [{ rotate: `${rotationDegree}deg` }] },
        ]}
      >
        <Text style={[styles.labelText, { color, fontSize }]}>{text}</Text>
      </View>
    );

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    textAlign: "center",
  },
});

export default createLabelComponent;
