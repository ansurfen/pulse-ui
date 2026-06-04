import { StyleSheet, ViewStyle } from "react-native";
import { usePulseTheme } from "@pulse-ui/core";
import { TextField, type TextFieldProps } from "../TextField";
import { SettingsRow } from "./SettingsRow";

export interface SettingsInputRowProps extends Omit<TextFieldProps, "style" | "containerStyle" | "inputStyle"> {
  label: string;
  showDivider?: boolean;
  disabled?: boolean;
  rowStyle?: ViewStyle;
  fieldStyle?: ViewStyle;
}

export function SettingsInputRow({
  label,
  showDivider = true,
  disabled = false,
  rowStyle,
  fieldStyle,
  clearable = false,
  theme,
  ...textFieldProps
}: SettingsInputRowProps) {
  const pulseTheme = usePulseTheme();
  return (
    <SettingsRow label={label} showDivider={showDivider} disabled={disabled} style={rowStyle}>
      <TextField
        disabled={disabled}
        clearable={clearable}
        theme={{
          backgroundColor: pulseTheme.colors.input.background,
          borderColor: pulseTheme.colors.input.border,
          focusedBorderColor: pulseTheme.colors.brand.secondary,
          ...theme
        }}
        style={{ ...settingsInputStyles.field, ...fieldStyle }}
        containerStyle={settingsInputStyles.container}
        {...textFieldProps}
      />
    </SettingsRow>
  );
}

const settingsInputStyles = StyleSheet.create({
  container: {
    width: 168,
    flexShrink: 0
  },
  field: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12
  }
});
