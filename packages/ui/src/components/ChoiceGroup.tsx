import { createContext, PropsWithChildren, useContext } from "react";

export interface ChoiceGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const ChoiceGroupContext = createContext<ChoiceGroupContextValue | null>(null);

export interface ChoiceGroupProps extends PropsWithChildren {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function ChoiceGroup({ value, onValueChange, disabled = false, children }: ChoiceGroupProps) {
  return <ChoiceGroupContext.Provider value={{ value, onValueChange, disabled }}>{children}</ChoiceGroupContext.Provider>;
}

export function useChoiceGroup() {
  return useContext(ChoiceGroupContext);
}

