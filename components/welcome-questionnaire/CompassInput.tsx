import { useState } from 'react';
import { PanResponder, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { GestureResponderEvent } from 'react-native-modal';
import { Text } from 'react-native-paper';

import Svg, { Line, Circle, Text as SvgText, Path } from 'react-native-svg';

export const CompassDirection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [rotation, setRotation] = useState(Number(value) || 0);
  const size = 150; // Reduced from 200
  const center = size / 2;
  const radius = (size - 30) / 2; // Reduced padding

  const calculateAngle = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const dx = locationX - center;
    const dy = locationY - center;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event) => {
      const angle = calculateAngle(event);
      setRotation(angle);
      onChange(Math.round(angle).toString());
    },
  });

  const handleDirectInput = (text: string) => {
    const num = Number(text);
    if (text === '' || isNaN(num)) {
      onChange(text);
      return;
    }
    // Normalize the angle to 0-360
    const normalizedAngle = ((num % 360) + 360) % 360;
    setRotation(normalizedAngle);
    onChange(normalizedAngle.toString());
  };

  return (
    <View style={styles.compassWrapper}>
      <View style={styles.compassContainer} {...panResponder.panHandlers}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <Circle cx={center} cy={center} r={radius} fill="#0F242A" stroke="#DBFFE8" strokeWidth="1" />

          {/* Degree marks - reduced frequency for cleaner look */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const isMainDirection = i % 9 === 0;
            const lineLength = isMainDirection ? 12 : 6;
            const x1 = center + (radius - lineLength) * Math.sin(angle);
            const y1 = center - (radius - lineLength) * Math.cos(angle);
            const x2 = center + radius * Math.sin(angle);
            const y2 = center - radius * Math.cos(angle);
            return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#DBFFE8" strokeWidth={isMainDirection ? '2' : '1'} />;
          })}

          {/* Cardinal directions */}
          {['N', 'E', 'S', 'W'].map((direction, i) => {
            const angle = (i * 90 * Math.PI) / 180;
            const x = center + (radius - 20) * Math.sin(angle);
            const y = center - (radius - 20) * Math.cos(angle);
            return (
              <SvgText key={direction} x={x} y={y} fill="#DBFFE8" fontSize="12" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                {direction}
              </SvgText>
            );
          })}

          {/* Direction arrow */}
          <Path d={`M ${center} ${center - radius + 8} L ${center - 8} ${center} L ${center + 8} ${center} Z`} fill="#DBFFE8" transform={`rotate(${rotation}, ${center}, ${center})`} />
        </Svg>
      </View>

      <View style={styles.compassInputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput style={[styles.input, styles.compassInput]} value={value} onChangeText={handleDirectInput} placeholder="0" placeholderTextColor="#6B7280" keyboardType="numeric" maxLength={3} />
          <Text style={styles.compassDegreeSymbol}>°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
  compassWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F242A',
    borderRadius: 8,
    padding: 5,
  },
  compassInputContainer: {
    flex: 1,
    marginLeft: 16,
  },
  compassInput: {
    textAlign: 'center',
    paddingRight: 20, // Space for degree symbol
  },
  compassDegreeSymbol: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    color: '#DBFFE8',
    fontSize: 16,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  compassInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  compassDegrees: {
    color: '#DBFFE8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  compassCardinal: {
    color: '#DBFFE8',
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#0F242A',
    borderRadius: 8,
    padding: 12,
    color: '#DBFFE8',
    fontSize: 16,
  },
});
