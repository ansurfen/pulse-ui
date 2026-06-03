import { ReactNode, useMemo } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export type TagVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "info";
export type TagSize = "sm" | "md";

export interface TagTheme {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export interface TagProps {
  label?: string;
  children?: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  theme?: TagTheme;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantThemes: Record<TagVariant, Required<TagTheme>> = {
  neutral: {
    backgroundColor: "#F2F2F2",
    textColor: "#8E8E8E",
    borderColor: "transparent"
  },
  primary: {
    backgroundColor: "#EAF7FF",
    textColor: "#1CB0F6",
    borderColor: "transparent"
  },
  success: {
    backgroundColor: "#E8F8E0",
    textColor: "#58A700",
    borderColor: "transparent"
  },
  warning: {
    backgroundColor: "#FFF4E8",
    textColor: "#FF9600",
    borderColor: "transparent"
  },
  danger: {
    backgroundColor: "#FFE8EC",
    textColor: colors.danger,
    borderColor: "transparent"
  },
  info: {
    backgroundColor: colors.surfaceAlt,
    textColor: colors.primary,
    borderColor: "transparent"
  }
};

function resolveTheme(variant: TagVariant, theme?: TagTheme): Required<TagTheme> {
  const preset = variantThemes[variant];

  return {
    backgroundColor: theme?.backgroundColor ?? preset.backgroundColor,
    textColor: theme?.textColor ?? preset.textColor,
    borderColor: theme?.borderColor ?? preset.borderColor
  };
}

export function Tag({
  label,
  children,
  variant = "neutral",
  size = "md",
  theme,
  style,
  textStyle
}: TagProps) {
  const resolvedTheme = useMemo(() => resolveTheme(variant, theme), [theme, variant]);
  const content = children ?? label;

  return (
    <View
      style={[
        styles.base,
        size === "sm" ? styles.sizeSm : styles.sizeMd,
        {
          backgroundColor: resolvedTheme.backgroundColor,
          borderColor: resolvedTheme.borderColor
        },
        resolvedTheme.borderColor !== "transparent" && styles.bordered,
        style
      ]}
    >
      {typeof content === "string" ? (
        <Text
          style={[
            styles.text,
            size === "sm" ? styles.textSm : styles.textMd,
            { color: resolvedTheme.textColor },
            textStyle
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  bordered: {
    borderWidth: 1
  },
  sizeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  sizeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6
  },
  text: {
    fontWeight: "700",
    textAlign: "center"
  },
  textSm: {
    fontSize: typography.caption
  },
  textMd: {
    fontSize: typography.body
  }
});
