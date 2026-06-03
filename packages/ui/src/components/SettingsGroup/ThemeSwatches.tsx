import { StyleSheet, View, ViewStyle } from "react-native";

export interface ThemeSwatchesProps {
  colors: string[];
  size?: number;
  gap?: number;
  style?: ViewStyle;
}

export function ThemeSwatches({ colors, size = 22, gap = 6, style }: ThemeSwatchesProps) {
  return (
    <View style={[styles.row, { gap }, style]}>
      {colors.map((color, index) => (
        <View
          key={`${color}-${index}`}
          style={[
            styles.swatch,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  swatch: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)"
  }
});
