import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

export const FocusableView: React.FC<{
  focused: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ focused, style, children }) => {
  return (
    <View style={style}>
      {children}
      {focused && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderWidth: 2, borderColor: "skyblue" },
          ]}
        />
      )}
    </View>
  );
};
