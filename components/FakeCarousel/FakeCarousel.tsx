import type { FocusableComponent, FocusableRef } from "../../@types/tvos";
import { Focusable } from "../Focusable";
import { useBool } from "../../hooks/useBool";
import { useFocusableRef } from "../../hooks/useFocusableRef";
import { useNextFocus } from "../../hooks/useNextFocus";
import { useOnRef } from "../../hooks/useOnRef";
import { useTVEvent } from "../../hooks/useTVEvent";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import type { FakeCarouselProps as FakeCarouselProps } from "./types";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { useLayout } from "../../hooks/useLayout";
import { useEffect } from "react";
import { Easing } from "react-native";

type DisplayItem<T> = {
  item: T;
  index: number;
  baseIndex: number;
};

const INDEX_OFFSET = 2;

const getBaseIndex = <T extends unknown>(
  index: number,
  baseArray: T[]
): number => {
  if (0 <= index && index < baseArray.length) {
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
  indexOffset: number = 2,
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
    onSelectElement,
    keyExtractor,
    renderItem,
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
  const renderableCount = useMemo(() => {
    return Math.ceil(containerWidth / itemSize.width) + INDEX_OFFSET * 2;
  }, [containerWidth, itemSize.width]);

  const getIndex = useCallback(
    (scrollPosition: number, round: boolean = false) => {
      const toFixedFractionDigits = 5;
      const itemIndex = Number(
        (scrollPosition / itemSize.width).toFixed(toFixedFractionDigits)
      );
      return round ? Math.round(itemIndex) : itemIndex;
    },
    [itemSize.width]
  );

  const [renderableItems, setRenderableItems] = useState<{
    items: DisplayItem<T>[];
    shifted: number;
  }>({
    items: [],
    shifted: 0,
  });

  const updateRenderableItems = useCallback(() => {
    const currentIndex = getIndex(lastScrollPosition.current);
    const newRenderableItem = createRenderableItemsFromData(
      currentIndex,
      renderableCount,
      INDEX_OFFSET,
      data
    );
    setRenderableItems({ items: newRenderableItem, shifted: currentIndex });
  }, [getIndex, renderableCount, data]);

  useEffect(() => {
    updateRenderableItems();
  }, [updateRenderableItems]);

  // console.log({
  //   renderableCount,
  //   renderableItems,
  //   currentIndex: getIndex(lastScrollPosition.current),
  // });

  const {
    bool: isFocusedContainer,
    setTrue: onFocus,
    setFalse: onBlur,
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
      isScrolling.current = true;
      Animated.timing(scrollAnimatedValue, {
        toValue: scrollOffset.offset,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      scrollAnimatedValue.setValue(scrollOffset.offset);
    }
  }, [scrollAnimatedValue, scrollOffset]);

  const tvEventListener = useMemo(
    () => ({
      right: () => {
        const currentIndex = getIndex(lastScrollPosition.current);
        scrollToIndex(currentIndex + 1);
        console.log("tvEventListener#right()", { currentIndex });
      },
      left: () => {
        const currentIndex = getIndex(lastScrollPosition.current);
        scrollToIndex(currentIndex - 1);
        console.log("tvEventListener#left()", { currentIndex });
      },
      select: () => {
        const currentIndex = getIndex(lastScrollPosition.current);
        const index = getBaseIndex(currentIndex, data);
        const item = data[index];
        console.log("FocusableCarousel#onSelect()", {
          index,
          currentIndex,
          item,
        });
        onSelectElement?.(item);
      },
    }),
    [getIndex, scrollToIndex, onSelectElement, data]
  );
  useTVEvent(tvEventListener, !isFocusedContainer);

  useNextFocus(selfRef, {
    nextFocusRight: null,
    nextFocusLeft: null,
  });

  return (
    <Focusable
      ref={onRef}
      onFocus={onFocus}
      onBlur={onBlur}
      onLayout={onLayoutContainer}
      style={{ width: "100%" }}
    >
      {(focused) => (
        <View>
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [
                {
                  translateX: Animated.multiply(
                    -1,
                    Animated.add(
                      scrollAnimatedValue,
                      (INDEX_OFFSET - renderableItems.shifted) * itemSize.width
                    )
                  ),
                },
              ],
            }}
          >
            {renderableItems.items.map(({ item, baseIndex }, i) => (
              <Animated.View
                key={keyExtractor(item) + `${i}`}
                style={{
                  ...itemSize,
                }}
              >
                {renderItem({ item, index: baseIndex })}
              </Animated.View>
            ))}
          </Animated.View>

          {focused && (
            <View
              style={{
                position: "absolute",
                ...itemSize,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
          )}
        </View>
      )}
    </Focusable>
  );
}) as <T>(
  props: FakeCarouselProps<T> & React.RefAttributes<FocusableComponent>
) => React.ReactElement | null;
