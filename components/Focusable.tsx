import React, { useCallback, useState } from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { FocusableContext, FocusableContextValue } from "./FocusableContext";

type TouchableComponentProps = TouchableOpacityProps;

export type FocusableProps = TouchableComponentProps & {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  children: (value: FocusableContextValue) => React.ReactNode;
};

export const Focusable = React.memo(
  React.forwardRef<TouchableOpacity, FocusableProps>(
    (
      { active = true, onFocus: _onFocus, onBlur: _onBlur, children, ...rest },
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

export const forceFocus = (ref: React.RefObject<TouchableOpacity>) => {
  ref.current?.setNativeProps({ hasTVPreferredFocus: true });
};
