import React, { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";
import { Easing } from "react-native";
import { Animated, View, StyleSheet } from "react-native";
import type {
  FlatListProps,
  ListRenderItemInfo,
  ViewStyle,
} from "react-native";
import type { FocusableRef } from "../@types/tvos";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { useFocusableRef } from "../hooks/useFocusableRef";
import { useNextFocus } from "../hooks/useNextFocus";
import { useTVEvent } from "../hooks/useTVEvent";
import type { TVEventListener } from "../hooks/useTVEvent";
import { forceFocus } from "../util/forceFocus";
import { Focusable } from "./Focusable";

export interface FocusableCarouselProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  nextFocusRight?: FocusableRef;
  nextFocusLeft?: FocusableRef;
  nextFocusUp?: FocusableRef;
  nextFocusDown?: FocusableRef;

  itemSize: { width: number; height: number };
  animationConfig?: Pick<Animated.TimingAnimationConfig, "duration" | "easing">;

  FocusFrameComponent?: React.ComponentType<{ focused: boolean }>;

  renderItem: (
    info: Omit<ListRenderItemInfo<ItemT>, "separators"> & { focused: boolean }
  ) => React.ReactNode;

  onListElementPress?: (
    info: Omit<ListRenderItemInfo<ItemT>, "separators">
  ) => void;
}

export const FocusableCarousel = <ItemT extends unknown>({
  data,
  itemSize,
  renderItem,
  onListElementPress,
  nextFocusDown,
  nextFocusUp,
  nextFocusRight,
  nextFocusLeft,
  animationConfig,
  FocusFrameComponent,
}: FocusableCarouselProps<ItemT>) => {
  const dataLength = data?.length ?? 0;

  const [focusIndex, setFocusIndex] = useState(0);
  const [containerFocused, setContainerFocused] = useState(false);
  const onContainerFocused = useCallback(() => setContainerFocused(true), []);
  const onContainerBlured = useCallback(() => setContainerFocused(false), []);

  const containerRef = useFocusableRef();
  useNextFocus(containerRef, {
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft: containerRef,
    nextFocusRight: containerRef,
  });

  const animatedValue = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focusIndex,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
      ...animationConfig,
    }).start();
  }, [focusIndex, animationConfig]);

  const tvEventListener = useMemo<TVEventListener>(
    () => ({
      left: () => {
        if (focusIndex !== 0) {
          setFocusIndex(focusIndex - 1);
        } else if (nextFocusLeft) {
          forceFocus(nextFocusLeft);
        }
      },
      right: () => {
        if (focusIndex + 1 < dataLength) {
          setFocusIndex(focusIndex + 1);
        } else if (nextFocusRight) {
          forceFocus(nextFocusRight);
        }
      },
      select: () => {
        onListElementPress?.({ item: data![focusIndex], index: focusIndex });
      },
    }),
    [data, focusIndex, nextFocusLeft, nextFocusRight, dataLength]
  );

  useTVEvent(tvEventListener, !containerFocused);

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: itemSize.height,
    }),
    [itemSize.height]
  );

  const itemsContainerStyle = useMemo<Animated.WithAnimatedArray<ViewStyle>>(
    () => [
      styles.absoluteContainer,
      {
        flexDirection: "row",
        transform: [
          {
            translateX: animatedValue.interpolate({
              inputRange: [0, dataLength - 1],
              outputRange: [0, -1 * (dataLength - 1) * itemSize.width],
            }),
          },
        ],
      },
    ],
    [animatedValue, dataLength, itemSize.width]
  );

  return (
    <Focusable
      ref={containerRef}
      onBlur={onContainerBlured}
      onFocus={onContainerFocused}
      style={containerStyle}
    >
      {(focused) => (
        <View style={containerStyle}>
          <Animated.View style={itemsContainerStyle}>
            {data?.map((item, index) => (
              <View key={index} style={itemSize}>
                {renderItem({ item, index, focused: index === focusIndex })}
              </View>
            ))}
          </Animated.View>
          {FocusFrameComponent && (
            <View
              style={[styles.absoluteContainer, itemSize]}
              pointerEvents="none"
            >
              <FocusFrameComponent focused={focused} />
            </View>
          )}
        </View>
      )}
    </Focusable>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "transparent",
  },
});
