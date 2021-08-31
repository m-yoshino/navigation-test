import { FocusableRefObject } from "@tvos/@types/tvos";
import { FeatureItem } from "src/domain/FeatureItem";
import {Animated} from "react-native";

export type FakeCarouselProps<T> = {
  data: T[];
  itemSize: { width: number; height: number };
  renderItem: (info: { item: T; index: number, animated: Animated.AnimatedInterpolation }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  onSelectElement?: (item: T) => void;
  indexOffset?: number;
  nextFocusLeft?: FocusableRefObject;
};

export type FakeCarouselRenderableItem<T> = {
  item: T;
  index: number;
  baseIndex: number;
};