import React, { ReactNode } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  useColorScheme,
  View,
  ViewStyle,
  ImageBackgroundProps,
  KeyboardAvoidingViewProps,
} from "react-native";

interface BackgroundProps {
  children: ReactNode;
  imageSource?: ImageBackgroundProps['source'];
  containerStyle?: ViewStyle;
  keyboardAvoidingViewProps?: Partial<KeyboardAvoidingViewProps>;
}

export default function Background({
  children,
  imageSource = require("@/assets/items/dot.png"),
  containerStyle,
  keyboardAvoidingViewProps,
}: BackgroundProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[
      styles.background,
      { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
    ]}>
      <ImageBackground
        source={imageSource}
        resizeMode="repeat"
        style={styles.imageBackground}
      >
        <KeyboardAvoidingView
          style={[styles.container, containerStyle]}
          behavior="padding"
          {...keyboardAvoidingViewProps}
        >
          {children}
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});