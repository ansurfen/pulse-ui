import { useMemo } from "react";
import { usePulseLegacyColors } from "@pulse-ui/core";

export const settingsBorder = {
  width: 2,
  color: "#E0E0E0",
  dividerColor: "#E8E8E8"
} as const;

export function useSettingsBorder() {
  const colors = usePulseLegacyColors();

  return useMemo(
    () => ({
      width: 2,
      color: colors.border,
      dividerColor: colors.border
    }),
    [colors.border]
  );
}
