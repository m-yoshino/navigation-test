import React from "react";
import { TouchableOpacity } from "react-native";

export const useFocusableRef = () => {
  return React.useRef<TouchableOpacity>(null);
};