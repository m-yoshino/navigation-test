import React from "react";
import type {TouchableOpacity, TouchableOpacityProps} from "react-native";

export type FocusableComponent = TouchableOpacity;
export type FocusableComponentProps = TouchableOpacityProps;
export type FocusableRefObject = React.RefObject<TouchableOpacity>;
export type FocusableRef = FocusableRefObject | ((instance: FocusableComponent | null) => void);