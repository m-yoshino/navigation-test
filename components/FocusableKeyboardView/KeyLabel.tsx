import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTVEvent } from "../../hooks/useTVEvent";
import type { TVEventListener } from "../../hooks/useTVEvent";
import { Focusable } from "../Focusable";
import { KEY_LABEL_SIZE } from "./constants";

export const KeyLabelView: React.FC<{
  focused: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ style, focused, children }) => (
  <View
    style={[
      {
        backgroundColor: focused ? "gray" : "black",
        alignItems: "center",
        justifyContent: "center",
      },
      style,
    ]}
  >
    <Text
      style={{
        color: "white",
      }}
    >
      {children}
    </Text>
  </View>
);

type Props = {
  label: string;
  onKeyPress: (label: string) => void;
};

export const KeyLabel = ({ label, onKeyPress }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  const tvEventListener = useMemo<TVEventListener>(
    () => ({
      select: () => onKeyPress(label),
    }),
    [onKeyPress, label]
  );
  useTVEvent(tvEventListener, !isFocused);

  return (
    <Focusable
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        backgroundColor: "transparent",
      }}
    >
      {(focused) => (
        <KeyLabelView
          focused={focused}
          style={{
            width: KEY_LABEL_SIZE,
            height: KEY_LABEL_SIZE,
          }}
        >
          {label}
        </KeyLabelView>
      )}
    </Focusable>
  );
};
