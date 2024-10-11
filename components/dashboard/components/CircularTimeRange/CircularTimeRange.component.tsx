import React from "react";
import { View, Image, ViewStyle } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { TimeSlot } from "../../utils/circularTimeRangeUtils";

interface CircularTimeRangeOptions {
  stepMins?: number;
  width?: number;
  height?: number;
}

interface CircularTimeRangeProps {
  slots: TimeSlot[];
  options?: CircularTimeRangeOptions;
  style?: ViewStyle;
}

const DEFAULT_OPTIONS: Required<CircularTimeRangeOptions> = {
  stepMins: 15,
  width: 200,
  height: 200,
};

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number): [number, number] => {
  const radians = ((angle - 90) * Math.PI) / 180.0;
  return [Math.round((cx + radius * Math.cos(radians)) * 100) / 100, Math.round((cy + radius * Math.sin(radians)) * 100) / 100];
};

const svgArcPath = (x: number, y: number, radius: number, range: [number, number]): string => {
  const [startAngle, endAngle] = range;
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end[0]} ${end[1]}`;
};

const timeToAngle = (time: number): number => ((time * 360) / 24) % 360;

const generateHourLines = (cx: number, cy: number, radius: number): React.ReactNode[] => {
  const hours = 24;
  const hourLines = [];
  for (let i = 0; i < hours; i++) {
    const angle = ((i * 360) / hours) % 360;
    const [startX, startY] = polarToCartesian(cx, cy, radius - 10, angle);
    const [endX, endY] = polarToCartesian(cx, cy, radius, angle);
    const [labelX, labelY] = polarToCartesian(cx, cy, radius - 20, angle);
    hourLines.push(
      <React.Fragment key={i}>
        <Line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#DBFFE8" strokeWidth="2" strokeLinecap="round" />
        {i % 2 === 0 && (
          <SvgText x={labelX} y={labelY} textAnchor="middle" alignmentBaseline="middle" fontSize="11" fill="#DBFFE8">
            {i}
          </SvgText>
        )}
      </React.Fragment>
    );
  }
  return hourLines;
};

const CircularTimeRange: React.FC<CircularTimeRangeProps> = ({ slots, options, style }) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { width, height } = mergedOptions;

  const drawSlots = () => {
    return slots.map((slot, index) => {
      const baseRadius = width / 2 - 60;
      const radius = baseRadius + 10;
      let startAngle = timeToAngle(slot.start);
      let endAngle = timeToAngle(slot.end);

      if (endAngle < startAngle) {
        endAngle += 360;
      }

      return <Path key={index} d={svgArcPath(width / 2, height / 2, radius, [startAngle, endAngle])} stroke={slot.color} strokeWidth="10" fill="none" strokeLinecap="round" />;
    });
  };

  return (
    <View style={[{ width, height, position: "relative" }, style]}>
      <Svg width={width} height={height} viewBox={`15 15 ${width - 30} ${height - 30}`}>
        {/* <Circle cx={width / 2} cy={height / 2} r={width / 2 - 50} fill="none" stroke="black" strokeWidth={4} /> */}
        {generateHourLines(width / 2, height / 2, width / 2 - 50)}
        {drawSlots()}
      </Svg>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("@/assets/branding/hw-iso-hor-green-01.png")} style={{ height: 48, width: 48 }} resizeMode="contain" />
      </View>
    </View>
  );
};

export default CircularTimeRange;
