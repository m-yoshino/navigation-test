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

export const FakeCarousel = React.forwardRef(function FakeCarousel<T>(
  props: FakeCarouselProps<T>,
  ref: FocusableRef | null
) {
  const { data, itemSize, keyExtractor, renderItem } = props;
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

  const scrollToIndex = useCallback(
    (index: number, animated: boolean = true) => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;

      const x = index * itemSize.width;
      console.log("scrollToIndex", { index, x });
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
    console.log("onScrollEnd");
  }, []);

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
  }, [scrollOffset]);

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
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [
                { translateX: Animated.multiply(-1, scrollAnimatedValue) },
              ],
            }}
          >
            {data.map((item, index) => (
              <Animated.View key={keyExtractor(item)} style={{ ...itemSize }}>
                {renderItem({ item, index })}
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
