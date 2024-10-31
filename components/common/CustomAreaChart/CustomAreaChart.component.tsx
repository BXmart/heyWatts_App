import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAnimatedReaction, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MINIMUM_ZOOM = 1;
const MAXIMUM_ZOOM = 24;
const PINCH_SENSITIVITY = 1; // Increased sensitivity
const PAN_SENSITIVITY = 0.1;
const BUFFER_FACTOR = 0.2; // Add 20% buffer on each side

interface DataPoint {
  value: number;
  label: string;
  timestamp: number;
}

interface AreaData {
  data: DataPoint[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
  id: string;
}

interface CustomAreaChartProps {
  data: AreaData[];
  height?: number;
  width?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  backgroundColor?: string;
}

const CustomAreaChart: React.FC<CustomAreaChartProps> = ({
  data,
  height = 300,
  width = SCREEN_WIDTH,
  paddingHorizontal = 40,
  paddingVertical = 30,
  showGrid = true,
  showLabels = true,
  backgroundColor = '#083344',
}) => {
  const chartWidth = width - paddingHorizontal * 2;
  const chartHeight = height - paddingVertical * 2;

  // Animated values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const startScale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const isPinching = useSharedValue(false);
  const initialFocalX = useSharedValue(0);

  // Local state for rendering
  const [chartState, setChartState] = useState({
    scale: 1,
    translateX: 0,
  });

  const getTimeFromLabel = useCallback((label: string) => {
    const [hours, minutes] = label.split(':').map(Number);
    return hours + minutes / 60;
  }, []);

  const getMinMaxValues = useCallback(() => {
    if (!data?.length || !data[0]?.data?.length) return { min: 0, max: 100 };
    const allValues = data.flatMap((series) => series.data.map((point) => point.value));
    return {
      min: Math.min(...allValues, 0),
      max: Math.max(...allValues),
    };
  }, [data]);

  const getVisibleRange = useCallback(() => {
    const totalRange = 24;
    const visibleRange = totalRange / chartState.scale;
    const offset = (-chartState.translateX / chartWidth) * totalRange * chartState.scale;

    // Add buffer to visible range
    const bufferSize = visibleRange * BUFFER_FACTOR;
    return {
      start: Math.max(0, offset - bufferSize),
      end: Math.min(24, offset + visibleRange + bufferSize),
      actualStart: offset,
      actualEnd: offset + visibleRange,
    };
  }, [chartState.scale, chartState.translateX, chartWidth]);

  const getVisibleData = useCallback(
    (seriesData: DataPoint[]) => {
      const { start, end } = getVisibleRange();

      return seriesData.filter((point) => {
        const time = getTimeFromLabel(point.label);
        return time >= start && time <= end;
      });
    },
    [getVisibleRange, getTimeFromLabel]
  );

  const createAreaPath = useCallback(
    (seriesData: DataPoint[]) => {
      if (!seriesData?.length) return '';

      const { min: minValue, max: maxValue } = getMinMaxValues();
      const valueRange = maxValue - minValue;
      const { start, end, actualStart, actualEnd } = getVisibleRange();

      // Only process visible points plus buffer
      const visiblePoints = getVisibleData(seriesData);

      if (visiblePoints.length < 2) return '';

      const points = visiblePoints.map((point) => {
        const time = getTimeFromLabel(point.label);
        const x = ((time - actualStart) / (actualEnd - actualStart)) * chartWidth + paddingHorizontal;
        const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight + paddingVertical;
        return `${x},${y}`;
      });

      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      const [firstX] = firstPoint.split(',');
      const [lastX] = lastPoint.split(',');

      return `
        M ${firstX},${chartHeight + paddingVertical}
        L ${points.join(' L ')}
        L ${lastX},${chartHeight + paddingVertical}
        Z
      `;
    },
    [chartWidth, chartHeight, getMinMaxValues, getVisibleRange, getTimeFromLabel, paddingHorizontal, paddingVertical, getVisibleData]
  );

  const renderGrid = useCallback(() => {
    if (!showGrid) return null;

    const { actualStart, actualEnd } = getVisibleRange();
    const lines = [];
    const { min: minValue, max: maxValue } = getMinMaxValues();

    // Horizontal lines
    const horizontalLines = 5;
    for (let i = 0; i <= horizontalLines; i++) {
      const y = paddingVertical + (chartHeight / horizontalLines) * i;
      const value = maxValue - (i / horizontalLines) * (maxValue - minValue);
      lines.push(
        <G key={`h-${i}`}>
          <Line x1={paddingHorizontal} y1={y} x2={width - paddingHorizontal} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {showLabels && (
            <SvgText x={paddingHorizontal - 10} y={y + 4} fill="white" fontSize={10} textAnchor="end">
              {value.toFixed(1)}
            </SvgText>
          )}
        </G>
      );
    }

    // Vertical time lines - only render visible ones
    const visibleHours = actualEnd - actualStart;
    const hourStep = visibleHours <= 4 ? 0.5 : visibleHours <= 8 ? 1 : 2;

    for (let time = Math.floor(actualStart); time <= Math.ceil(actualEnd); time += hourStep) {
      if (time < 0 || time > 24) continue;

      const x = ((time - actualStart) / (actualEnd - actualStart)) * chartWidth + paddingHorizontal;
      if (x >= paddingHorizontal && x <= width - paddingHorizontal) {
        lines.push(
          <G key={`v-${time}`}>
            <Line x1={x} y1={paddingVertical} x2={x} y2={height - paddingVertical} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            {showLabels && (
              <SvgText x={x} y={height - 10} fill="white" fontSize={10} textAnchor="middle">
                {`${Math.floor(time).toString().padStart(2, '0')}:${((time % 1) * 60).toFixed(0).padStart(2, '0')}`}
              </SvgText>
            )}
          </G>
        );
      }
    }

    return lines;
  }, [chartHeight, chartWidth, getMinMaxValues, getVisibleRange, height, paddingHorizontal, paddingVertical, showLabels, width]);
  // Update chart state when animated values change
  useAnimatedReaction(
    () => ({
      scale: scale.value,
      translateX: translateX.value,
    }),
    (current, previous) => {
      if (current.scale !== previous?.scale || current.translateX !== previous?.translateX) {
        runOnJS(setChartState)(current);
      }
    }
  );
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      isPinching.value = true;
      startScale.value = scale.value;
      lastScale.value = scale.value;

      // Store initial focal point relative to chart content
      const adjustedFocalX = event.focalX - paddingHorizontal;
      initialFocalX.value = (adjustedFocalX - translateX.value) / scale.value;
    })
    .onUpdate((event) => {
      const newScale = Math.min(Math.max(startScale.value * Math.pow(event.scale, PINCH_SENSITIVITY), MINIMUM_ZOOM), MAXIMUM_ZOOM);

      // Calculate new translation to maintain focal point
      const adjustedFocalX = event.focalX - paddingHorizontal;
      const newFocalX = initialFocalX.value * newScale;
      const newTranslateX = adjustedFocalX - newFocalX;

      // Apply bounds to translation
      const maxPan = -(chartWidth * (newScale - 1));
      translateX.value = Math.max(Math.min(newTranslateX, 0), maxPan);

      scale.value = newScale;
      lastScale.value = newScale;
    })
    .onEnd(() => {
      isPinching.value = false;
      const roundedScale = Math.round(scale.value * 2) / 2;

      scale.value = withSpring(roundedScale, {
        damping: 20,
        stiffness: 200,
      });

      const maxPan = -(chartWidth * (roundedScale - 1));
      translateX.value = withSpring(Math.max(Math.min(translateX.value, 0), maxPan), {
        damping: 20,
        stiffness: 200,
      });
    });

  const panGesture = Gesture.Pan()
    .enabled(!isPinching.value)
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const maxPan = -(chartWidth * (scale.value - 1));
      const translation = event.translationX * PAN_SENSITIVITY;
      translateX.value = Math.max(Math.min(startX.value + translation, 0), maxPan);
    })
    .onEnd(() => {
      const maxPan = -(chartWidth * (scale.value - 1));
      translateX.value = withSpring(Math.max(Math.min(translateX.value, 0), maxPan), {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture);

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.chartWrapper, { height }]}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.chartContainer}>
            <Svg width={width} height={height}>
              <Defs>
                {data.map((series) => (
                  <LinearGradient key={series.id} id={`gradient-${series.id}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={series.gradientFrom} stopOpacity="0.5" />
                    <Stop offset="1" stopColor={series.gradientTo} stopOpacity="0.1" />
                  </LinearGradient>
                ))}
              </Defs>
              {renderGrid()}
              {data.map((series) => (
                <Path key={series.id} d={createAreaPath(series.data)} fill={`url(#gradient-${series.id})`} stroke={series.color} strokeWidth={2} />
              ))}
            </Svg>
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  chartWrapper: {
    overflow: 'hidden',
  },
  chartContainer: {
    height: '100%',
    transformOrigin: 'left',
  },
});

export default CustomAreaChart;
