import Svg, { Circle } from "react-native-svg";
import { colors } from "@pulse-ui/core";

export function ResetViewIcon({ disabled = false }: { disabled?: boolean }) {
  const color = disabled ? colors.textMuted : colors.secondary;

  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" accessibilityRole="image">
      <Circle cx={9} cy={9} r={6.25} stroke={color} strokeWidth={1.5} fill="none" />
      <Circle cx={9} cy={9} r={1.75} fill={color} />
      <Circle cx={9} cy={3.25} r={1} fill={color} />
      <Circle cx={9} cy={14.75} r={1} fill={color} />
      <Circle cx={3.25} cy={9} r={1} fill={color} />
      <Circle cx={14.75} cy={9} r={1} fill={color} />
    </Svg>
  );
}
