import React, { useCallback, useState } from "react";
import { useMemo } from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { TVEventListener, useTVEvent } from "../hooks/useTVEvent";
import { FocusableContext, FocusableContextValue } from "./FocusableContext";

export type TouchableComponentProps = Omit<TouchableOpacityProps, "onPress">;
export type FocusableProps = TouchableComponentProps & {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: (value: FocusableContextValue) => React.ReactNode;
};

export const Focusable = React.memo(
  React.forwardRef<TouchableOpacity, FocusableProps>(
    (
      {
        active = true,
        onFocus: _onFocus,
        onBlur: _onBlur,
        onPress,
        children,
        ...rest
      },
      ref
    ) => {
      const [focusableContextValue, setFocusableContextValue] =
        useState<FocusableContextValue>(false);

      const onFocus = useCallback<Required<TouchableComponentProps>["onFocus"]>(
        (event) => {
          setFocusableContextValue(true);
          _onFocus?.(event);
        },
        [_onFocus]
      );

      const onBlur = useCallback<Required<TouchableComponentProps>["onBlur"]>(
        (event) => {
          setFocusableContextValue(false);
          _onBlur?.(event);
        },
        [_onBlur]
      );

      const tvEventListener = useMemo<TVEventListener>(
        () => ({
          select: () => onPress?.(),
        }),
        [onPress]
      );
      useTVEvent(tvEventListener, !focusableContextValue);

      return (
        <FocusableContext.Provider value={focusableContextValue}>
          <TouchableOpacity
            ref={ref}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={!active}
            {...rest}
          >
            <FocusableContext.Consumer children={children} />
          </TouchableOpacity>
        </FocusableContext.Provider>
      );
    }
  )
);
