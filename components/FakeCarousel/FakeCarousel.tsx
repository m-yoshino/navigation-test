import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Animated, View, Easing } from "react-native";
import { Focusable } from "../Focusable";
import { useBool } from "../../hooks/useBool";
import { useFocusableRef } from "../../hooks/useFocusableRef";
import { useNextFocus } from "../../hooks/useNextFocus";
import { useOnRef } from "../../hooks/useOnRef";
import { useTVEvent } from "../../hooks/useTVEvent";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { useLayout } from "../../hooks/useLayout";
import type { FocusableComponent, FocusableRef } from "../../@types/tvos";
import type { FakeCarouselProps, FakeCarouselRenderableItem } from "./types";

const DEFAULT_ANIMATION_CONFIG: NonNullable<
  FakeCarouselProps<unknown>["animationConfig"]
> = {
  duration: 250,
  easing: Easing.out(Easing.ease),
};

const isIndexInBaseArray = <T extends unknown>(
  index: number,
  baseArray: T[]
): boolean => {
  return 0 <= index && index < baseArray.length;
};

const getBaseIndex = <T extends unknown>(
  index: number,
  baseArray: T[]
): number => {
  if (isIndexInBaseArray(index, baseArray)) {
    return index;
  }
  if (index < 0) {
    return getBaseIndex<T>(baseArray.length + index, baseArray);
  }
  return getBaseIndex<T>(index - baseArray.length, baseArray);
};

const createRenderableItemsFromData = <T extends unknown>(
  currentIndex: number,
  renderableCount: number,
  indexOffset: number,
  data: T[]
) => {
  return Array.from({ length: renderableCount }).map((_, i) => {
    const index = i + currentIndex - indexOffset;
    const baseIndex = getBaseIndex(index, data);
    return {
      item: data[baseIndex],
      index,
      baseIndex,
    };
  });
};

export const FakeCarousel = React.forwardRef(function FakeCarousel<T>(
  {
    data,
    itemSize,
    indexOffset = 2,
    keyExtractor,
    renderItem,
    animationConfig,
    onSelectElement,
    onFocus: propsOnFocus,
    onBlur: propsOnBlur,
  }: FakeCarouselProps<T>,
  ref: FocusableRef | null
) {
  const { width: containerWidth, onLayout: onLayoutContainer } = useLayout();
  const selfRef = useFocusableRef();
  const onRef = useOnRef(selfRef, ref);
  const scrollAnimatedValue = useAnimatedValue();
  const lastScrollPosition = useRef<number>(0);
  const [scrollOffset, setScrollOffset] = useState<{
    offset: number;
    animated: boolean;
  }>({ offset: 0, animated: false });
  const isScrolling = useRef<boolean>(false);
  const scrollEndTimer = useRef<NodeJS.Timeout | null>(null);
  const renderableCount = useMemo(
    () => Math.ceil(containerWidth / itemSize.width) + indexOffset * 2,
    [containerWidth, itemSize.width, indexOffset]
  );

  const getCurrentIndex = useCallback(() => {
    const toFixedFractionDigits = 5;
    return Number(
      (lastScrollPosition.current / itemSize.width).toFixed(
        toFixedFractionDigits
      )
    );
  }, [itemSize.width]);

  const [renderableItems, setRenderableItems] = useState<{
    items: FakeCarouselRenderableItem<T>[];
    shifted: number;
  }>({
    items: [],
    shifted: 0,
  });

  const updateRenderableItems = useCallback(() => {
    const currentIndex = getCurrentIndex();
    const newRenderableItem = createRenderableItemsFromData(
      currentIndex,
      renderableCount,
      indexOffset,
      data
    );
    setRenderableItems({ items: newRenderableItem, shifted: currentIndex });
  }, [getCurrentIndex, renderableCount, data, indexOffset]);

  useEffect(() => {
    updateRenderableItems();
  }, [updateRenderableItems]);

  const {
    bool: isFocusedContainer,
    setTrue: _onFocus,
    setFalse: _onBlur,
  } = useBool(false);

  const scrollToIndex = useCallback(
    (index: number, animated: boolean = true) => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;

      const x = index * itemSize.width;
      if (lastScrollPosition.current === x) {
        isScrolling.current = false;
        return;
      }
      setScrollOffset({ offset: x, animated });
    },
    [itemSize.width]
  );

  const onScrollEnd = useCallback(() => {
    scrollEndTimer.current = null;
    isScrolling.current = false;
    updateRenderableItems();
  }, [updateRenderableItems]);

  useEffect(() => {
    const listenerID = scrollAnimatedValue.addListener(({ value }) => {
      lastScrollPosition.current = value;
      if (scrollEndTimer.current !== null) {
        clearTimeout(scrollEndTimer.current);
      }
      scrollEndTimer.current = setTimeout(() => {
        onScrollEnd();
      }, 100);
    });
    return () => {
      scrollAnimatedValue.removeListener(listenerID);
      if (scrollEndTimer.current !== null) {
        clearTimeout(scrollEndTimer.current);
      }
    };
  }, [scrollAnimatedValue, onScrollEnd]);

  useEffect(() => {
    if (scrollOffset.animated) {
      Animated.timing(scrollAnimatedValue, {
        ...DEFAULT_ANIMATION_CONFIG,
        ...animationConfig,
        toValue: scrollOffset.offset,
        useNativeDriver: true,
      }).start();
    } else {
      scrollAnimatedValue.setValue(scrollOffset.offset);
    }
  }, [scrollAnimatedValue, scrollOffset, animationConfig]);

  const tvEventListener = useMemo(
    () => ({
      right: () => {
        const currentIndex = getCurrentIndex();
        scrollToIndex(currentIndex + 1);
      },
      left: () => {
        const currentIndex = getCurrentIndex();
        scrollToIndex(currentIndex - 1);
      },
      select: () => {
        const currentIndex = getCurrentIndex();
        const index = getBaseIndex(currentIndex, data);
        const item = data[index];
        onSelectElement?.({ item, index });
      },
    }),
    [getCurrentIndex, scrollToIndex, onSelectElement, data]
  );
  useTVEvent(tvEventListener, !isFocusedContainer);

  useNextFocus(selfRef, {
    nextFocusRight: null,
    nextFocusLeft: null,
  });

  const onFocus = useCallback<NonNullable<FakeCarouselProps<T>["onFocus"]>>(
    (event) => {
      _onFocus();
      propsOnFocus?.(event);
    },
    []
  );

  const onBlur = useCallback<NonNullable<FakeCarouselProps<T>["onBlur"]>>(
    (event) => {
      _onBlur();
      propsOnBlur?.(event);
    },
    [_onBlur, propsOnBlur]
  );

  return (
    <Focusable
      ref={onRef}
      onFocus={onFocus}
      onBlur={onBlur}
      onLayout={onLayoutContainer}
      style={{ width: "100%" }}
    >
      {() => (
        <Animated.View
          style={{
            flexDirection: "row",
            transform: [
              {
                translateX: Animated.multiply(
                  -1,
                  Animated.add(
                    scrollAnimatedValue,
                    (indexOffset - renderableItems.shifted) * itemSize.width
                  )
                ),
              },
            ],
          }}
        >
          {renderableItems.items.map(({ item, baseIndex }, i) => {
            const animatedIndex = i - indexOffset + renderableItems.shifted;
            const key = `${keyExtractor(item)}_${i}`;
            return (
              <View key={key} style={itemSize}>
                {renderItem({
                  item,
                  index: baseIndex,
                  animated: Animated.divide(
                    scrollAnimatedValue,
                    itemSize.width
                  ).interpolate({
                    inputRange: [
                      animatedIndex - 1,
                      animatedIndex,
                      animatedIndex + 1,
                    ],
                    outputRange: [0, 1, 0],
                    extrapolate: "clamp",
                  }),
                })}
              </View>
            );
          })}
        </Animated.View>
      )}
    </Focusable>
  );
}) as <T>(
  props: FakeCarouselProps<T> & React.RefAttributes<FocusableComponent>
) => React.ReactElement | null;
