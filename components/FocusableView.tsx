import React from "react";
import { View, StyleSheet } from "react-native";

export const FocusableView: React.FC<{ focused: boolean }> = ({
  focused,
  children,
}) => {
  return (
    <View>
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
