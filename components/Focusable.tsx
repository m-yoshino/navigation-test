import React, { useCallback, useContext } from "react";
import { createContext } from "react";
import { useState } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  StyleSheet,
} from "react-native";

export const FocusableContext = createContext(false);

export const CommonFocusView: React.FC = ({ children }) => {
  const isFocused = useContext(FocusableContext);
  return (
    <>
      {children}
      {isFocused && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderWidth: 2, borderColor: "skyblue" },
          ]}
        />
      )}
    </>
  );
};

export const Focusable: React.FC<
  Pick<TouchableOpacityProps, "onFocus" | "onBlur" | "onPress">
> = ({ children, onPress, ...rest }) => {
  const [isFocused, setFocusFlag] = useState(false);
  const onFocus = useCallback<Required<TouchableOpacityProps>["onFocus"]>(
    (event) => {
      setFocusFlag(true);
      rest.onFocus?.(event);
    },
    [rest.onFocus]
  );
  const onBlur = useCallback<Required<TouchableOpacityProps>["onBlur"]>(
    (event) => {
      setFocusFlag(false);
      rest.onBlur?.(event);
    },
    [rest.onBlur]
  );
  return (
    <FocusableContext.Provider value={isFocused}>
      <TouchableOpacity onFocus={onFocus} onBlur={onBlur} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </FocusableContext.Provider>
  );
};
