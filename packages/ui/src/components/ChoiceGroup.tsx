import { createContext, PropsWithChildren, useContext } from "react";

export type ChoiceGroupContextValue =
  | {
      mode: "single";
      value?: string;
      onValueChange?: (value: string) => void;
      disabled?: boolean;
    }
  | {
      mode: "multiple";
      value?: string[];
      onValueChange?: (value: string[]) => void;
      disabled?: boolean;
    };

const ChoiceGroupContext = createContext<ChoiceGroupContextValue | null>(null);

type ChoiceGroupSingleProps = PropsWithChildren<{
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>;

type ChoiceGroupMultipleProps = PropsWithChildren<{
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}>;

export type ChoiceGroupProps = ChoiceGroupSingleProps | ChoiceGroupMultipleProps;

export function ChoiceGroup(props: ChoiceGroupProps) {
  const { disabled = false, children } = props;

  const contextValue: ChoiceGroupContextValue =
    props.multiple === true
      ? { mode: "multiple", value: props.value, onValueChange: props.onValueChange, disabled }
      : { mode: "single", value: props.value, onValueChange: props.onValueChange, disabled };

  return <ChoiceGroupContext.Provider value={contextValue}>{children}</ChoiceGroupContext.Provider>;
}

export function useChoiceGroup() {
  return useContext(ChoiceGroupContext);
}

