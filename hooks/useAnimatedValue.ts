import { useRef } from "react";
import { Animated } from "react-native";

export const useAnimatedValue = (def: number = 0) => {
  const value = useRef<Animated.Value>(new Animated.Value(def));
  return value.current;
};