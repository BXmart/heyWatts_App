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
  numberOfDots = 6, // Increased default number of dots
  isLoading = true,
}) => {
  const animatedValues = useRef(
    Array(numberOfDots)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animatedValues.forEach((value) => value.stopAnimation());

    if (!isLoading) {
      // Calculate shorter duration for smoother movement
      const dotDuration = duration * 0.8;
      // Reduced delay between dots for closer spacing
      const delayBetweenDots = dotDuration / (numberOfDots * 2);

      const animations = animatedValues.map((value, index) =>
        Animated.sequence([
          // Reset position
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          // Add initial delay based on dot position
          Animated.delay(delayBetweenDots * index),
          // Animate to end
          Animated.timing(value, {
            toValue: 1,
            duration: dotDuration,
            useNativeDriver: true,
          }),
        ])
      );

      // Start the animation loop with staggered timing
      Animated.loop(Animated.stagger(delayBetweenDots, animations)).start();
    }

    return () => {
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, [duration, numberOfDots, isLoading, reverse]);

  const containerStyle = {
    width: direction === 'horizontal' ? length : dotSize,
    height: direction === 'vertical' ? length : dotSize,
  };

  const createDotStyle = (animValue) => {
    const dotPosition = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: reverse ? [length - dotSize, 0] : [0, length - dotSize],
    });

    // Adjusted opacity interpolation for smoother fade
    const dotOpacity = animValue.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    });

    // Calculate smaller dot size when more dots are present
    const adjustedDotSize = Math.min(dotSize, length / (numberOfDots * 1.5));

    return {
      width: adjustedDotSize,
      height: adjustedDotSize,
      borderRadius: adjustedDotSize / 2,
      backgroundColor: dotColor,
      position: 'absolute',
      opacity: dotOpacity,
      transform: [direction === 'horizontal' ? { translateX: dotPosition } : { translateY: dotPosition }],
    };
  };

  if (isLoading) {
    return <View style={[styles.container, containerStyle, style]} />;
  }

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
    overflow: 'hidden', // Prevent dots from showing outside container
  },
});

export default DottedLine;
