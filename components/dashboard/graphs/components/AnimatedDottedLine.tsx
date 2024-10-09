import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const MultiDot = ({ style = {}, length = 200, dotSize = 10, dotColor = "red", direction = "horizontal", duration = 2000, reverse = false, numberOfDots = 3 }) => {
  const animatedValues = useRef(
    Array(numberOfDots)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((value, index) =>
      Animated.loop(
        Animated.timing(value, {
          toValue: 1,
          duration: duration,
          delay: (duration / numberOfDots) * index,
          useNativeDriver: true,
        })
      )
    );

    Animated.parallel(animations).start();

    return () => animations.forEach((anim) => anim.stop());
  }, [duration, numberOfDots]);

  const containerStyle = {
    width: direction === "horizontal" ? length : dotSize,
    height: direction === "vertical" ? length : dotSize,
  };

  const createDotStyle = (animValue: any) => {
    const dotPosition = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: reverse ? [length - dotSize, 0] : [0, length - dotSize],
    });

    const dotOpacity = animValue.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    });

    return {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: dotColor,
      position: "absolute",
      opacity: dotOpacity,
      transform: [direction === "horizontal" ? { translateX: dotPosition } : { translateY: dotPosition }],
    };
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {animatedValues.map((value, index) => (
        <Animated.View key={index} style={createDotStyle(value)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});

export default MultiDot;
