import { FocusableRefObject } from "@tvos/@types/tvos";
import { FeatureItem } from "src/domain/FeatureItem";

export type FocusableCarouselProps<T> = {
  data: T[];
  itemSize: { width: number; height: number };
  renderItem: (info: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  nextFocusLeft?: FocusableRefObject;
};
