import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "@pulse-ui/core";
import { MatchToken, type MatchTokenStatus } from "./MatchToken";

type Side = "left" | "right";
type TokenKey = `${Side}:${string}`;

export interface MatchBoardItem {
  value: string;
  index?: number | string;
  leftIndex?: number | string;
  rightIndex?: number | string;
  leftLabel?: string;
  rightLabel?: string;
}

export interface MatchBoardProps<TItem extends MatchBoardItem = MatchBoardItem> {
  items: readonly TItem[];
  rows?: number;
  correctHoldMs?: number;
  disabledHoldMs?: number;
  wrongHoldMs?: number;
  renderLeft?: (item: TItem) => ReactNode;
  renderRight?: (item: TItem) => ReactNode;
  style?: ViewStyle;
  columnStyle?: ViewStyle;
  onComplete?: () => void;
}

type MatchBoardState = {
  selected: { side: Side; value: string } | null;
  statuses: Record<TokenKey, MatchTokenStatus>;
  leftSlots: string[];
  rightSlots: string[];
  queue: string[];
};

function getTokenKey(side: Side, value: string): TokenKey {
  return `${side}:${value}`;
}

function shuffle<T>(items: readonly T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function buildInitialState<TItem extends MatchBoardItem>(items: readonly TItem[], rows: number): MatchBoardState {
  const values = shuffle(items.map((item) => item.value));
  const visibleCount = Math.min(Math.max(rows, 1), values.length);
  const visibleValues = values.slice(0, visibleCount);
  const queue = values.slice(visibleCount);

  return {
    selected: null,
    statuses: {},
    leftSlots: shuffle(visibleValues),
    rightSlots: shuffle(visibleValues),
    queue
  };
}

function clearStatuses(statuses: Record<TokenKey, MatchTokenStatus>, value: string) {
  const next = { ...statuses };
  delete next[getTokenKey("left", value)];
  delete next[getTokenKey("right", value)];
  return next;
}

export function MatchBoard<TItem extends MatchBoardItem = MatchBoardItem>({
  items,
  rows = 4,
  correctHoldMs = 900,
  disabledHoldMs = 480,
  wrongHoldMs = 720,
  renderLeft,
  renderRight,
  style,
  columnStyle,
  onComplete
}: MatchBoardProps<TItem>) {
  const itemMap = useMemo(() => {
    const next = new Map<string, TItem>();
    items.forEach((item) => next.set(item.value, item));
    return next;
  }, [items]);
  const [state, setState] = useState<MatchBoardState>(() => buildInitialState(items, rows));
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setState(buildInitialState(items, rows));
  }, [items, rows]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];
    },
    []
  );

  useEffect(() => {
    const allVisibleDisabled =
      state.leftSlots.length > 0 &&
      state.leftSlots.every((value) => state.statuses[getTokenKey("left", value)] === "disabled") &&
      state.rightSlots.every((value) => state.statuses[getTokenKey("right", value)] === "disabled");

    if (state.queue.length === 0 && allVisibleDisabled) {
      onComplete?.();
    }
  }, [onComplete, state.leftSlots, state.queue.length, state.rightSlots, state.statuses]);

  const schedule = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  };

  const resolveCorrect = (value: string, leftKey: TokenKey, rightKey: TokenKey) => {
    schedule(() => {
      setState((current) => {
        if (
          current.statuses[leftKey] !== "correct" ||
          current.statuses[rightKey] !== "correct"
        ) {
          return current;
        }

        return {
          ...current,
          statuses: {
            ...current.statuses,
            [leftKey]: "disabled",
            [rightKey]: "disabled"
          }
        };
      });
    }, correctHoldMs);

    schedule(() => {
      setState((current) => {
        if (current.queue.length === 0) {
          return current;
        }

        const [nextValue, ...restQueue] = current.queue;
        const leftSlots = current.leftSlots.map((entry) => (entry === value ? nextValue : entry));
        const rightSlots = current.rightSlots.map((entry) => (entry === value ? nextValue : entry));
        const statuses = clearStatuses(current.statuses, value);

        return {
          ...current,
          leftSlots,
          rightSlots,
          queue: restQueue,
          statuses
        };
      });
    }, correctHoldMs + disabledHoldMs);
  };

  const handlePress = (side: Side, value: string) => {
    const currentKey = getTokenKey(side, value);

    if (state.statuses[currentKey] === "correct" || state.statuses[currentKey] === "disabled") {
      return;
    }

    if (!state.selected) {
      setState((current) => ({ ...current, selected: { side, value } }));
      return;
    }

    if (state.selected.side === side) {
      setState((current) => ({ ...current, selected: { side, value } }));
      return;
    }

    const firstKey = getTokenKey(state.selected.side, state.selected.value);

    if (state.selected.value === value) {
      setState((current) => ({
        ...current,
        selected: null,
        statuses: {
          ...current.statuses,
          [firstKey]: "correct",
          [currentKey]: "correct"
        }
      }));
      resolveCorrect(value, firstKey, currentKey);
      return;
    }

    setState((current) => ({
      ...current,
      selected: null,
      statuses: {
        ...current.statuses,
        [firstKey]: "wrong",
        [currentKey]: "wrong"
      }
    }));

    schedule(() => {
      setState((current) => {
        const nextStatuses = { ...current.statuses };
        if (nextStatuses[firstKey] === "wrong") {
          delete nextStatuses[firstKey];
        }
        if (nextStatuses[currentKey] === "wrong") {
          delete nextStatuses[currentKey];
        }

        return {
          ...current,
          statuses: nextStatuses
        };
      });
    }, wrongHoldMs);
  };

  const getStatus = (side: Side, value: string): MatchTokenStatus => {
    const stateValue = state.statuses[getTokenKey(side, value)];

    if (stateValue) {
      return stateValue;
    }

    if (state.selected?.side === side && state.selected.value === value) {
      return "selected";
    }

    return "idle";
  };

  return (
    <View style={[styles.board, style]}>
      <View style={[styles.column, columnStyle]}>
        {state.leftSlots.map((value, index) => {
          const item = itemMap.get(value);
          if (!item) {
            return null;
          }

          return (
            <MatchToken
              key={`left-${value}-${index}`}
              label={item.leftLabel ?? item.value}
              value={value}
              index={item.leftIndex ?? item.index}
              status={getStatus("left", value)}
              onPress={() => handlePress("left", value)}
            >
              {renderLeft ? renderLeft(item) : undefined}
            </MatchToken>
          );
        })}
      </View>

      <View style={[styles.column, columnStyle]}>
        {state.rightSlots.map((value, index) => {
          const item = itemMap.get(value);
          if (!item) {
            return null;
          }

          return (
            <MatchToken
              key={`right-${value}-${index}`}
              value={value}
              label={item.rightLabel ?? item.value}
              index={item.rightIndex ?? item.index}
              status={getStatus("right", value)}
              onPress={() => handlePress("right", value)}
            >
              {renderRight ? renderRight(item) : undefined}
            </MatchToken>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl
  },
  column: {
    flex: 1,
    minWidth: 280,
    gap: spacing.md
  }
});
