import { ViewStyle } from "react-native";
import { SelectDropdown, type SelectDropdownProps } from "../SelectDropdown";
import { SettingsRow } from "./SettingsRow";

export interface SettingsSelectRowProps<TValue extends string = string>
  extends Omit<SelectDropdownProps<TValue>, "style" | "variant"> {
  label: string;
  showDivider?: boolean;
  disabled?: boolean;
  rowStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  menuPresentation?: SelectDropdownProps<TValue>["menuPresentation"];
}

export function SettingsSelectRow<TValue extends string = string>({
  label,
  showDivider = true,
  disabled = false,
  rowStyle,
  dropdownStyle,
  menuPresentation = "drawer-bottom",
  ...dropdownProps
}: SettingsSelectRowProps<TValue>) {
  return (
    <SettingsRow label={label} showDivider={showDivider} disabled={disabled} style={rowStyle}>
      <SelectDropdown
        variant="inline"
        menuPresentation={menuPresentation}
        style={dropdownStyle}
        {...dropdownProps}
      />
    </SettingsRow>
  );
}
