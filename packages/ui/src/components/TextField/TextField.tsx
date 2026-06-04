import { forwardRef, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";
import { TextFieldClearIcon, TextFieldErrorIcon, TextFieldEyeIcon, TextFieldEyeOffIcon } from "./TextFieldIcons";
import {
  TextFieldValidateFn,
  TextFieldValidateOn,
  useTextFieldValidation
} from "./useTextFieldValidation";

export type { TextFieldValidateFn, TextFieldValidateOn };

export interface TextFieldTheme {
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  errorBorderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  selectionColor?: string;
  errorTextColor?: string;
  errorIconColor?: string;
  errorIconGlyphColor?: string;
  clearButtonBackgroundColor?: string;
  clearButtonIconColor?: string;
  suffixIconColor?: string;
}

export interface TextFieldRef {
  validate: () => string | undefined;
  clearValidation: () => void;
  getValue: () => string;
  focus: () => void;
  blur: () => void;
}

export interface TextFieldProps extends Omit<TextInputProps, "style" | "placeholderTextColor" | "selectionColor" | "value" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  theme?: TextFieldTheme;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  validate?: TextFieldValidateFn;
  validateOn?: TextFieldValidateOn | TextFieldValidateOn[];
  showErrorMessage?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

function resolveTheme(baseTheme: Required<TextFieldTheme>, theme?: TextFieldTheme): Required<TextFieldTheme> {
  return {
    backgroundColor: theme?.backgroundColor ?? baseTheme.backgroundColor,
    borderColor: theme?.borderColor ?? baseTheme.borderColor,
    focusedBorderColor: theme?.focusedBorderColor ?? baseTheme.focusedBorderColor,
    errorBorderColor: theme?.errorBorderColor ?? baseTheme.errorBorderColor,
    textColor: theme?.textColor ?? baseTheme.textColor,
    placeholderColor: theme?.placeholderColor ?? baseTheme.placeholderColor,
    selectionColor: theme?.selectionColor ?? baseTheme.selectionColor,
    errorTextColor: theme?.errorTextColor ?? baseTheme.errorTextColor,
    errorIconColor: theme?.errorIconColor ?? baseTheme.errorIconColor,
    errorIconGlyphColor: theme?.errorIconGlyphColor ?? baseTheme.errorIconGlyphColor,
    clearButtonBackgroundColor: theme?.clearButtonBackgroundColor ?? baseTheme.clearButtonBackgroundColor,
    clearButtonIconColor: theme?.clearButtonIconColor ?? baseTheme.clearButtonIconColor,
    suffixIconColor: theme?.suffixIconColor ?? baseTheme.suffixIconColor
  };
}

export const TextField = forwardRef<TextFieldRef, TextFieldProps>(function TextField(
  {
    value,
    defaultValue = "",
    onChangeText,
    onClear,
    placeholder,
    theme,
    clearable = true,
    showPasswordToggle,
    secureTextEntry = false,
    prefix,
    suffix,
    disabled = false,
    error,
    errorMessage,
    validate,
    validateOn,
    showErrorMessage = true,
    style,
    inputStyle,
    containerStyle,
    onFocus,
    onBlur,
    editable,
    ...inputProps
  },
  ref
) {
  const pulseTheme = usePulseTheme();
  const baseTheme = useMemo<Required<TextFieldTheme>>(
    () => ({
      backgroundColor: pulseTheme.colors.input.background,
      borderColor: pulseTheme.colors.input.border,
      focusedBorderColor: pulseTheme.colors.input.focusedBorder,
      errorBorderColor: pulseTheme.colors.feedback.danger,
      textColor: pulseTheme.colors.input.text,
      placeholderColor: pulseTheme.colors.input.placeholder,
      selectionColor: pulseTheme.colors.input.caret,
      errorTextColor: pulseTheme.colors.feedback.danger,
      errorIconColor: pulseTheme.colors.feedback.danger,
      errorIconGlyphColor: pulseTheme.colors.text.inverse,
      clearButtonBackgroundColor: pulseTheme.colors.input.clear,
      clearButtonIconColor: pulseTheme.colors.text.inverse,
      suffixIconColor: pulseTheme.colors.input.suffix
    }),
    [pulseTheme]
  );
  const resolvedTheme = useMemo(() => resolveTheme(baseTheme, theme), [baseTheme, theme]);
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : uncontrolledValue;

  const validation = useTextFieldValidation({
    value: resolvedValue,
    validate,
    validateOn,
    error,
    errorMessage
  });

  const isPassword = secureTextEntry || showPasswordToggle === true;
  const shouldTogglePassword = showPasswordToggle ?? secureTextEntry;
  const hasValue = resolvedValue.length > 0;
  const isFocused = focused && !disabled;
  const showClear = clearable && hasValue && isFocused && !isPassword && !validation.hasError;
  const showPasswordSuffix = shouldTogglePassword && !disabled;
  const resolvedSecureEntry = isPassword && !passwordVisible;
  const showMessage = showErrorMessage && validation.errorMessage;

  useImperativeHandle(
    ref,
    () => ({
      validate: validation.validateNow,
      clearValidation: validation.clearValidation,
      getValue: () => resolvedValue,
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur()
    }),
    [resolvedValue, validation.clearValidation, validation.validateNow]
  );

  function setFieldValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChangeText?.(nextValue);
    validation.handleChangeText(nextValue);
  }

  function handleClear(event?: { preventDefault?: () => void }) {
    if (Platform.OS === "web") {
      event?.preventDefault?.();
    }
    setFieldValue("");
    onClear?.();
    inputRef.current?.focus();
  }

  function resolveBorderColor() {
    if (validation.hasError) {
      return resolvedTheme.errorBorderColor;
    }

    if (isFocused) {
      return resolvedTheme.focusedBorderColor;
    }

    return resolvedTheme.borderColor;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.shell,
          {
            backgroundColor: resolvedTheme.backgroundColor,
            borderColor: resolveBorderColor()
          },
          disabled && styles.shellDisabled,
          style
        ]}
      >
        {prefix ? <View style={styles.affix}>{prefix}</View> : null}
        <TextInput
          {...inputProps}
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={editable ?? !disabled}
          value={resolvedValue}
          onChangeText={setFieldValue}
          placeholder={placeholder}
          placeholderTextColor={resolvedTheme.placeholderColor}
          selectionColor={resolvedTheme.selectionColor}
          secureTextEntry={resolvedSecureEntry}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            validation.handleBlur();
            onBlur?.(event);
          }}
          style={[
            styles.input,
            {
              color: resolvedTheme.textColor
            },
            Boolean(showClear || showPasswordSuffix || suffix) && styles.inputWithSuffix,
            inputStyle
          ]}
        />
        {showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="清除"
            hitSlop={8}
            onPressIn={handleClear}
            onPress={handleClear}
            style={styles.suffixButton}
          >
            <TextFieldClearIcon
              backgroundColor={resolvedTheme.clearButtonBackgroundColor}
              iconColor={resolvedTheme.clearButtonIconColor}
            />
          </Pressable>
        ) : null}
        {showPasswordSuffix ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "隐藏密码" : "显示密码"}
            hitSlop={8}
            onPress={() => setPasswordVisible((current) => !current)}
            style={styles.suffixButton}
          >
            {passwordVisible ? (
              <TextFieldEyeIcon color={resolvedTheme.suffixIconColor} />
            ) : (
              <TextFieldEyeOffIcon color={resolvedTheme.suffixIconColor} />
            )}
          </Pressable>
        ) : null}
        {!showClear && !showPasswordSuffix && suffix ? <View style={styles.affix}>{suffix}</View> : null}
      </View>
      {showMessage ? (
        <View style={styles.messageRow} accessibilityRole="alert">
          <TextFieldErrorIcon color={resolvedTheme.errorIconColor} iconColor={resolvedTheme.errorIconGlyphColor} />
          {typeof validation.errorMessage === "string" ? (
            <Text style={[styles.messageText, { color: resolvedTheme.errorTextColor }]}>{validation.errorMessage}</Text>
          ) : (
            validation.errorMessage
          )}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm
  },
  shell: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg
  },
  shellDisabled: {
    opacity: 0.55
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
    fontSize: typography.bodyLg,
    fontWeight: "500",
    borderWidth: 0,
    backgroundColor: "transparent",
    ...(Platform.OS === "web"
      ? ({
        outlineStyle: "none",
        outlineWidth: 0,
        boxShadow: "none"
      } as unknown as TextStyle)
      : null)
  },
  inputWithSuffix: {
    paddingRight: spacing.sm
  },
  affix: {
    marginRight: spacing.sm
  },
  suffixButton: {
    marginLeft: spacing.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs
  },
  messageText: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: "500",
    lineHeight: 20
  }
});
