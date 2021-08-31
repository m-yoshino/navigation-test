import type { FocusableRefObject } from "../../@types/tvos";
import {Animated} from "react-native";
import type {ViewProps} from "react-native";
import type {FocusableProps} from "../Focusable";

export type FakeCarouselProps<T> = {
  data: T[];
  itemSize: { width: number; height: number };
  renderItem: (info: { item: T; index: number, animated: Animated.AnimatedInterpolation }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  align?: "flex-start" | "center";
  indexOffset?: number;
  nextFocusLeft?: FocusableRefObject;
  animationConfig?: Omit<Animated.TimingAnimationConfig, "useNativeDriver" | "toValue">
  onSelectElement?: (info: {item: T, index: number}) => void;
  onLayout?: NonNullable<ViewProps["onLayout"]>;
} & Pick<FocusableProps, "onFocus" | "onBlur">;

export type FakeCarouselRenderableItem<T> = {
  item: T;
  index: number;
  baseIndex: number;
};