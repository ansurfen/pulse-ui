import Svg, { Circle } from "react-native-svg";
import { usePulseTheme } from "@pulse-ui/core";

type ResetViewIconProps = {
  disabled?: boolean;
  size?: number;
};

export function ResetViewIcon({ disabled = false, size = 20 }: ResetViewIconProps) {
  const theme = usePulseTheme();
  const color = disabled ? theme.colors.text.muted : theme.colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" accessibilityRole="image">
      <Circle cx={11} cy={11} r={7.25} stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx={11} cy={11} r={2.1} fill={color} />
      <Circle cx={11} cy={4.15} r={1.1} fill={color} />
      <Circle cx={11} cy={17.85} r={1.1} fill={color} />
      <Circle cx={4.15} cy={11} r={1.1} fill={color} />
      <Circle cx={17.85} cy={11} r={1.1} fill={color} />
    </Svg>
  );
}
