import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DottedLine = ({
  style = {},
  length = 200,
  dotSize = 10,
  dotColor = 'red',
  direction = 'horizontal',
  duration = 2000,
  reverse = false,
  numberOfDots = 6,
  isLoading = false, // Changed default to false
}) => {
  const animatedValues = useRef(
    Array(numberOfDots)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Stop any existing animations
    animatedValues.forEach((value) => value.stopAnimation());

    if (!isLoading) {
      // Changed condition to run animation when NOT loading
      const dotDuration = duration * 0.8;
      const delayBetweenDots = dotDuration / (numberOfDots * 2);

      const animations = animatedValues.map((value, index) => {
        return Animated.sequence([
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(delayBetweenDots * index),
          Animated.timing(value, {
            toValue: 1,
            duration: dotDuration,
            useNativeDriver: true,
          }),
        ]);
      });

      // Run animations in parallel with staggered delays
      Animated.loop(Animated.stagger(delayBetweenDots, animations)).start();
    }

    return () => {
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, [duration, numberOfDots, isLoading, reverse]);

  const containerStyle = {
    width: direction === 'horizontal' ? length : dotSize,
    height: direction === 'vertical' ? length : dotSize,
    backgroundColor: 'transparent', // Added for visibility
  };

  const createDotStyle = (animValue) => {
    const moveDistance = length - dotSize;

    const dotPosition = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: reverse ? [moveDistance, 0] : [0, moveDistance],
    });

    const dotOpacity = animValue.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });

    const adjustedDotSize = Math.min(dotSize, length / (numberOfDots * 1.5));

    return {
      position: 'absolute',
      width: adjustedDotSize,
      height: adjustedDotSize,
      borderRadius: adjustedDotSize / 2,
      backgroundColor: dotColor,
      opacity: dotOpacity,
      transform: [direction === 'horizontal' ? { translateX: dotPosition } : { translateY: dotPosition }],
    };
  };

  // Removed the isLoading condition check here
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
    position: 'relative',
    overflow: 'hidden',
  },
});

export default DottedLine;
