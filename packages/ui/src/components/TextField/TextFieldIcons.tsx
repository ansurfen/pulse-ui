import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

export function TextFieldErrorIcon({
  size = 16,
  color = "#FF4B4B",
  iconColor = "#FFFFFF"
}: {
  size?: number;
  color?: string;
  iconColor?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" accessibilityRole="image">
      <Circle cx={8} cy={8} r={8} fill={color} />
      <Rect x={7.25} y={3.6} width={1.5} height={5.6} rx={0.75} fill={iconColor} />
      <Circle cx={8} cy={11.5} r={0.95} fill={iconColor} />
    </Svg>
  );
}

export function TextFieldClearIcon({
  size = 22,
  backgroundColor = "#C4C4C4",
  iconColor = "#FFFFFF"
}: {
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" accessibilityRole="image">
      <Circle cx={11} cy={11} r={11} fill={backgroundColor} />
      <Line x1={7.2} y1={7.2} x2={14.8} y2={14.8} stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
      <Line x1={14.8} y1={7.2} x2={7.2} y2={14.8} stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function TextFieldEyeIcon({ size = 22, color = "#84D8FF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" accessibilityRole="image">
      <Path
        d="M11 5.2c-4.1 0-7.4 2.8-8.6 5.8 1.2 3 4.5 5.8 8.6 5.8s7.4-2.8 8.6-5.8C18.4 8 15.1 5.2 11 5.2Z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
      />
      <Circle cx={11} cy={11} r={2.4} fill={color} />
    </Svg>
  );
}

export function TextFieldEyeOffIcon({ size = 22, color = "#84D8FF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" accessibilityRole="image">
      <Path
        d="M11 5.2c-4.1 0-7.4 2.8-8.6 5.8 1.2 3 4.5 5.8 8.6 5.8s7.4-2.8 8.6-5.8C18.4 8 15.1 5.2 11 5.2Z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
      />
      <Circle cx={11} cy={11} r={2.4} fill={color} />
      <Line x1={4.8} y1={17.2} x2={17.2} y2={4.8} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
