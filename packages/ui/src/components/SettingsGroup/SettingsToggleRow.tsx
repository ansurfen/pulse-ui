import { ViewStyle } from "react-native";
import { Toggle, type ToggleProps } from "../Toggle";
import { SettingsRow } from "./SettingsRow";

export interface SettingsToggleRowProps extends Omit<ToggleProps, "style"> {
  label: string;
  showDivider?: boolean;
  disabled?: boolean;
  rowStyle?: ViewStyle;
}

export function SettingsToggleRow({
  label,
  showDivider = true,
  disabled = false,
  rowStyle,
  ...toggleProps
}: SettingsToggleRowProps) {
  return (
    <SettingsRow label={label} showDivider={showDivider} disabled={disabled} style={rowStyle}>
      <Toggle disabled={disabled} {...toggleProps} />
    </SettingsRow>
  );
}
