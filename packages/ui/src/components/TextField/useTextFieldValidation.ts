import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

export type TextFieldValidateOn = "change" | "blur" | "submit";
export type TextFieldValidateFn = (value: string) => string | undefined | null;

export interface UseTextFieldValidationOptions {
  value: string;
  validate?: TextFieldValidateFn;
  validateOn?: TextFieldValidateOn | TextFieldValidateOn[];
  error?: boolean;
  errorMessage?: ReactNode;
}

function normalizeValidateOn(validateOn?: TextFieldValidateOn | TextFieldValidateOn[]) {
  if (!validateOn) {
    return new Set<TextFieldValidateOn>(["submit"]);
  }

  const entries = Array.isArray(validateOn) ? validateOn : [validateOn];
  return new Set(entries);
}

export function useTextFieldValidation({
  value,
  validate,
  validateOn,
  error,
  errorMessage
}: UseTextFieldValidationOptions) {
  const validateOnSet = useMemo(() => normalizeValidateOn(validateOn), [validateOn]);
  const [internalMessage, setInternalMessage] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const runValidate = useCallback(
    (nextValue: string) => {
      if (!validate) {
        setInternalMessage(undefined);
        return undefined;
      }

      const result = validate(nextValue);
      const message = result || undefined;
      setInternalMessage(message);
      return message;
    },
    [validate]
  );

  const shouldShowInternalMessage = Boolean(
    internalMessage &&
      (submitted || (touched && validateOnSet.has("blur")) || validateOnSet.has("change"))
  );

  const resolvedMessage = errorMessage ?? (shouldShowInternalMessage ? internalMessage : undefined);
  const hasError = error ?? Boolean(resolvedMessage);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validateOnSet.has("blur")) {
      runValidate(value);
    }
  }, [runValidate, validateOnSet, value]);

  const handleChangeText = useCallback(
    (nextValue: string) => {
      if (validateOnSet.has("change")) {
        runValidate(nextValue);
      } else if (submitted) {
        runValidate(nextValue);
      }
    },
    [runValidate, submitted, validateOnSet]
  );

  const validateNow = useCallback(() => {
    setSubmitted(true);
    setTouched(true);
    return runValidate(value);
  }, [runValidate, value]);

  const clearValidation = useCallback(() => {
    setInternalMessage(undefined);
    setSubmitted(false);
    setTouched(false);
  }, []);

  useEffect(() => {
    if (validateOnSet.has("change")) {
      runValidate(value);
    }
  }, [runValidate, validateOnSet, value]);

  return {
    hasError,
    errorMessage: resolvedMessage,
    handleBlur,
    handleChangeText,
    validateNow,
    clearValidation
  };
}
