import React, { createContext, useContext } from "react";
import { TouchableOpacity } from "react-native";

type Touchable = TouchableOpacity;

export const SidebarTabNavigatorFocusContext = createContext<{
  ref: React.RefObject<Touchable | null>;
  isFocusedTab: boolean;
}>({ ref: { current: null }, isFocusedTab: false });
export const useSideBarTabNavigatorFocusContext = (): {ref: React.RefObject<Touchable | null> | undefined, isFocusedTab: boolean} => {
  const context = useContext(SidebarTabNavigatorFocusContext);
  return { ref: context.ref.current !== null ? context.ref : undefined, isFocusedTab: context.isFocusedTab };
};
