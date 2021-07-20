import React, { createContext, useContext } from "react";
import { TouchableHighlight, TouchableOpacity } from "react-native";

export const SidebarTabNavigatorFocusContext = createContext<{ref: React.RefObject<TouchableOpacity | TouchableHighlight | null> }>({ref: {current: null}});
export const useSideBarTabNavigatorFocusContext = () => {
  const context = useContext(SidebarTabNavigatorFocusContext);
  return context.ref.current !== null ? context : undefined;
};
