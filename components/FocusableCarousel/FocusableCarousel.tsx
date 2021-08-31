import type { FocusableComponent, FocusableRef } from "../../@types/tvos";
import { Focusable } from "../Focusable";
import { useBool } from "../../hooks/useBool";
import { useFocusableRef } from "../../hooks/useFocusableRef";
import { useNextFocus } from "../../hooks/useNextFocus";
import { useOnRef } from "../../hooks/useOnRef";
import { useTVEvent } from "../../hooks/useTVEvent";
import React, { useCallback, useMemo, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import type { ScrollViewProps } from "react-native";
import type { FocusableCarouselProps } from "./types";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { useLayout } from "../../hooks/useLayout";

export const FocusableCarousel = React.forwardRef(function FocusableCarousel<T>(
  props: FocusableCarouselProps<T>,
  ref: FocusableRef | null
) {
  const { data, itemSize, keyExtractor, renderItem } = props;
  const { width: containerWidth, onLayout: onLayoutContainer } = useLayout();
  const selfRef = useFocusableRef();
  const onRef = useOnRef(selfRef, ref);
  const scrollViewRef = useRef<ScrollView>();
  const scrollAnimatedValue = useAnimatedValue();
  const lastScrollPosition = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  const scrollEndTimer = useRef<NodeJS.Timeout | null>(null);

  const getIndex = useCallback(
    (scrollPosition: number, round: boolean = false) => {
      const toFixedFractionDigits = 5;
      const itemIndex = Number(
        (scrollPosition / itemSize.width).toFixed(toFixedFractionDigits)
      );
      if (round) {
        return Math.round(itemIndex);
      } else {
        return itemIndex;
      }
    },
    [itemSize.width]
  );

  const {
    bool: isFocusedContainer,
    setTrue: onFocus,
    setFalse: onBlur,
  } = useBool(false);

  const contentSize = useRef<number>(0);
  const onContentSizeChange = useCallback<
    NonNullable<ScrollViewProps["onContentSizeChange"]>
  >((_contentSize) => {
    contentSize.current = _contentSize;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, animated: boolean = true) => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;
      if (scrollViewRef.current) {
        const x = index * itemSize.width;
        if (x <= contentSize.current) {
          if (lastScrollPosition.current !== x) {
            scrollViewRef.current.scrollTo({ x, y: 0, animated });
          }
        }
      }
    },
    [itemSize.width]
  );

  const onScrollEnd = useCallback(() => {
    scrollEndTimer.current = null;
    isScrolling.current = false;
  }, []);

  const onScroll = useCallback<NonNullable<ScrollViewProps["onScroll"]>>(
    ({ nativeEvent }) => {
      const position = nativeEvent.contentOffset.x;
      lastScrollPosition.current = position;

      if (scrollEndTimer.current !== null) {
        clearTimeout(scrollEndTimer.current);
      }
      scrollEndTimer.current = setTimeout(onScrollEnd, 100);
    },
    []
  );

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
        console.log("FocusableCarousel#onSelect()");
      },
    }),
    [getIndex, scrollToIndex]
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
    >
      {(focused) => (
        <View>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            onContentSizeChange={onContentSizeChange}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollAnimatedValue },
                  },
                },
              ],
              {
                useNativeDriver: true,
                listener: onScroll,
              }
            )}
          >
            {data.map((item, index) => (
              <Animated.View key={keyExtractor(item)} style={{ ...itemSize }}>
                {renderItem({ item, index })}
              </Animated.View>
            ))}
          </Animated.ScrollView>

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
  props: FocusableCarouselProps<T> & React.RefAttributes<FocusableComponent>
) => React.ReactElement | null;
