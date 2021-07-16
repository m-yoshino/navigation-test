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

export const Focusable: React.FC<TouchableOpacityProps> = ({
  onFocus: _onFocus,
  onBlur: _onBlur,
  ...rest
}) => {
  const [isFocused, setFocusFlag] = useState(false);
  const onFocus = useCallback<Required<TouchableOpacityProps>["onFocus"]>(
    (event) => {
      setFocusFlag(true);
      _onFocus?.(event);
    },
    [_onFocus]
  );
  const onBlur = useCallback<Required<TouchableOpacityProps>["onBlur"]>(
    (event) => {
      setFocusFlag(false);
      _onBlur?.(event);
    },
    [_onBlur]
  );
  return (
    <FocusableContext.Provider value={isFocused}>
      <TouchableOpacity onFocus={onFocus} onBlur={onBlur} {...rest} />
    </FocusableContext.Provider>
  );
};
