import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal, StatusBar } from 'react-native';
import Svg, { Path, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAnimatedReaction, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINIMUM_ZOOM = 1;
const MAXIMUM_ZOOM = 24;
const DEFAULT_TIME_RANGE = { start: 0, end: 24, total: 24 };
const DEFAULT_VALUE_RANGE = { min: 0, max: 100 };

const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width: Math.max(width, height),
    height: Math.min(width, height),
  };
};

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
  height = 290,
  width = Dimensions.get('window').width,
  paddingHorizontal = 40,
  paddingVertical = 30,
  showGrid = true,
  showLabels = true,
  backgroundColor = '#083344',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState(getScreenDimensions());

  // Update dimensions on device rotation
  React.useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions(getScreenDimensions());
      }
    };

    const dimensionsHandler = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      dimensionsHandler.remove();
    };
  }, [isFullscreen]);

  // Use full screen dimensions when in fullscreen mode
  const currentWidth = isFullscreen ? SCREEN_HEIGHT : width;
  const currentHeight = isFullscreen ? SCREEN_WIDTH : height;
  const chartWidth = currentWidth - paddingHorizontal * 2;
  const chartHeight = currentHeight - paddingVertical * 2;

  // Animated values
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);
  const startScale = useSharedValue(1);
  const isPinching = useSharedValue(false);

  // Local state for rendering
  const [chartState, setChartState] = useState({
    scale: 1,
    offsetX: 0,
  });

  const getTimeFromLabel = useCallback((label: string) => {
    const [hours, minutes] = label.split(':').map(Number);
    return hours + minutes / 60;
  }, []);

  const timeRange = useMemo(() => {
    if (!data.length || !data[0].data.length) {
      return DEFAULT_TIME_RANGE;
    }

    const allTimes = data.flatMap((series) => series.data.map((point) => getTimeFromLabel(point.label)));

    const start = Math.floor(Math.min(...allTimes));
    const end = Math.ceil(Math.max(...allTimes));

    return {
      start,
      end,
      total: end - start,
    };
  }, [data, getTimeFromLabel]);

  const getMinMaxValues = useCallback(() => {
    if (!data?.length || !data[0]?.data?.length) {
      return DEFAULT_VALUE_RANGE;
    }
    const allValues = data.flatMap((series) => series.data.map((point) => point.value));
    return {
      min: Math.min(...allValues, 0),
      max: Math.max(...allValues),
    };
  }, [data]);

  const getVisibleRange = useCallback(() => {
    const visibleRange = timeRange.total / chartState.scale;
    const offset = (-chartState.offsetX / chartWidth) * timeRange.total;

    const start = timeRange.start + offset;
    const end = start + visibleRange;

    return {
      start: Math.max(timeRange.start, start),
      end: Math.min(timeRange.end, end),
      actualStart: start,
      actualEnd: end,
    };
  }, [chartState.scale, chartState.offsetX, chartWidth, timeRange]);

  const createAreaPath = useCallback(
    (seriesData: DataPoint[]) => {
      if (!seriesData?.length) return '';

      const { min: minValue, max: maxValue } = getMinMaxValues();
      const valueRange = maxValue - minValue;
      const { start, end } = getVisibleRange();

      const visiblePoints = seriesData.filter((point) => {
        const time = getTimeFromLabel(point.label);
        return time >= start && time <= end;
      });

      if (visiblePoints.length < 2) return '';

      const points = visiblePoints.map((point) => {
        const time = getTimeFromLabel(point.label);
        const x = ((time - start) / (end - start)) * chartWidth + paddingHorizontal;
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
    [chartWidth, chartHeight, getMinMaxValues, getVisibleRange, getTimeFromLabel, paddingHorizontal, paddingVertical]
  );

  const renderGrid = useCallback(() => {
    if (!showGrid) return null;

    const { start, end } = getVisibleRange();
    const lines = [];
    const { min: minValue, max: maxValue } = getMinMaxValues();

    // Horizontal lines
    const horizontalLines = 5;
    for (let i = 0; i <= horizontalLines; i++) {
      const y = paddingVertical + (chartHeight / horizontalLines) * i;
      const value = maxValue - (i / horizontalLines) * (maxValue - minValue);
      lines.push(
        <G key={`h-${i}`}>
          <Line x1={paddingHorizontal} y1={y} x2={currentWidth - paddingHorizontal} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {showLabels && (
            <SvgText x={paddingHorizontal - 5} y={y + 4} fill="white" fontSize={10} textAnchor="end">
              {value.toFixed(1)}
            </SvgText>
          )}
        </G>
      );
    }

    // Vertical time lines
    const visibleHours = end - start;
    const hourStep = visibleHours <= 4 ? 0.5 : visibleHours <= 8 ? 1 : 2;

    for (let time = Math.floor(start); time <= Math.ceil(end); time += hourStep) {
      if (time < timeRange.start || time > timeRange.end) continue;

      const x = ((time - start) / (end - start)) * chartWidth + paddingHorizontal;

      if (x >= paddingHorizontal && x <= currentWidth - paddingHorizontal) {
        lines.push(
          <G key={`v-${time}`}>
            <Line x1={x} y1={paddingVertical} x2={x} y2={currentHeight - paddingVertical} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            {showLabels && (
              <SvgText x={x} y={currentHeight - paddingVertical + 20} fill="white" fontSize={10} textAnchor="middle">
                {`${Math.floor(time).toString().padStart(2, '0')}:${((time % 1) * 60).toFixed(0).padStart(2, '0')}`}
              </SvgText>
            )}
          </G>
        );
      }
    }

    return lines;
  }, [chartHeight, chartWidth, getMinMaxValues, getVisibleRange, currentHeight, currentWidth, paddingHorizontal, paddingVertical, showLabels, timeRange, showGrid]);

  useAnimatedReaction(
    () => ({
      scale: scale.value,
      offsetX: offsetX.value,
    }),
    (current, previous) => {
      if (current.scale !== previous?.scale || current.offsetX !== previous?.offsetX) {
        runOnJS(setChartState)(current);
      }
    }
  );

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
      startX.value = offsetX.value;
      isPinching.value = true;
    })
    .onUpdate((event) => {
      const newScale = Math.min(Math.max(startScale.value * event.scale, MINIMUM_ZOOM), MAXIMUM_ZOOM);
      scale.value = newScale;

      const pinchCenter = isFullscreen ? event.focalY - paddingHorizontal : event.focalX - paddingHorizontal;

      const newX = startX.value + pinchCenter * (1 - event.scale);
      const maxOffset = 0;
      const minOffset = -chartWidth * (1 - 1 / newScale);
      offsetX.value = Math.min(maxOffset, Math.max(minOffset, newX));
    })
    .onEnd(() => {
      isPinching.value = false;
      const roundedScale = Math.round(scale.value * 2) / 2;
      scale.value = withSpring(roundedScale);

      const maxOffset = 0;
      const minOffset = -chartWidth * (1 - 1 / roundedScale);
      offsetX.value = withSpring(Math.min(maxOffset, Math.max(minOffset, offsetX.value)));
    });

  const panGesture = Gesture.Pan()
    .enabled(!isPinching.value)
    .onStart(() => {
      startX.value = offsetX.value;
    })
    .onUpdate((event) => {
      const translation = isFullscreen ? event.translationY : event.translationX;
      const newX = startX.value + translation;
      const maxOffset = 0;
      const minOffset = -chartWidth * (1 - 1 / scale.value);
      offsetX.value = Math.min(maxOffset, Math.max(minOffset, newX));
    })
    .onEnd((event) => {
      const maxOffset = 0;
      const minOffset = -chartWidth * (1 - 1 / scale.value);
      const velocity = isFullscreen ? event.velocityY : event.velocityX;

      offsetX.value = withSpring(Math.min(maxOffset, Math.max(minOffset, offsetX.value)), {
        velocity: velocity,
        damping: 15,
        stiffness: 100,
      });
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    scale.value = withSpring(1);
    offsetX.value = withSpring(0);
  }, [scale, offsetX]);

  const renderChart = () => (
    <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.chartWrapper,
          {
            height: currentHeight,
            width: currentWidth,
            transform: isFullscreen ? [{ rotate: '90deg' }] : [],
          },
        ]}
      >
        <TouchableOpacity style={[styles.fullscreenButton, isFullscreen && styles.fullscreenButtonLandscape]} onPress={handleToggleFullscreen}>
          {isFullscreen ? <Feather name="minimize" size={24} color="white" /> : <Feather name="maximize" size={24} color="white" />}
        </TouchableOpacity>

        <GestureDetector gesture={composedGesture}>
          <View style={styles.chartContainer}>
            <Svg width={currentWidth} height={currentHeight}>
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

  return (
    <>
      {!isFullscreen ? (
        renderChart()
      ) : (
        <Modal animationType="fade" transparent={false} visible={isFullscreen} onRequestClose={handleToggleFullscreen}>
          <StatusBar hidden={isFullscreen} />
          <View style={[styles.fullscreenContainer, { backgroundColor }]}>
            <View style={styles.landscapeContainer}>{renderChart()}</View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  chartWrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  chartContainer: {
    height: '100%',
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeContainer: {
    width: SCREEN_HEIGHT,
    height: SCREEN_WIDTH,
    position: 'absolute',
    left: (SCREEN_WIDTH - SCREEN_HEIGHT) / 2,
    top: (SCREEN_HEIGHT - SCREEN_WIDTH) / 2,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 8,
  },
  fullscreenButtonLandscape: {
    transform: [{ rotate: '-90deg' }],
  },
});

export default CustomAreaChart;
