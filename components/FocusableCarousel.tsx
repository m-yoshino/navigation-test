import React, { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";
import { Easing } from "react-native";
import { Animated, View, StyleSheet } from "react-native";
import type { FlatListProps, ListRenderItemInfo } from "react-native";
import type { FocusableRef } from "../@types/tvos";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { useFocusableRef } from "../hooks/useFocusableRef";
import { useNextFocus } from "../hooks/useNextFocus";
import { useTVEvent } from "../hooks/useTVEvent";
import type { TVEventListener } from "../hooks/useTVEvent";
import { forceFocus } from "../util/forceFocus";
import { Focusable } from "./Focusable";
import { useLayout } from "../hooks/useLayout";

const DEFAULT_WINDOW_SIZE = 3;
const DEFAULT_ANIMATION_CONFIG = {
  duration: 250,
  easing: Easing.out(Easing.ease),
};

export interface FocusableCarouselProps<ItemT>
  extends Pick<FlatListProps<ItemT>, "data" | "ListEmptyComponent"> {
  nextFocusRight?: FocusableRef;
  nextFocusLeft?: FocusableRef;
  nextFocusUp?: FocusableRef;
  nextFocusDown?: FocusableRef;

  FocusFrameComponent?: React.ComponentType<{ focused: boolean }>;

  containerHeight: number;

  windowSize?: number;

  getItemLayout: NonNullable<FlatListProps<ItemT>["getItemLayout"]>;

  renderItem: (
    info: Omit<ListRenderItemInfo<ItemT>, "separators"> & { focused: boolean }
  ) => React.ReactNode;

  onListElementPress?: (
    info: Omit<ListRenderItemInfo<ItemT>, "separators">
  ) => void;

  animationConfig?: Pick<Animated.TimingAnimationConfig, "duration" | "easing">;
}

export const FocusableCarousel = <ItemT extends unknown>({
  data,
  renderItem,
  onListElementPress,
  containerHeight,
  nextFocusDown,
  nextFocusUp,
  nextFocusRight,
  nextFocusLeft,
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  FocusFrameComponent,
  ListEmptyComponent,
  windowSize = DEFAULT_WINDOW_SIZE,
  getItemLayout,
}: FocusableCarouselProps<ItemT>) => {
  const dataLength = data?.length ?? 0;
  const isEmpty = dataLength === 0;

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
      height: containerHeight,
    }),
    [containerHeight]
  );

  const { width: containerWidth, onLayout: onLayoutContainer } = useLayout();

  const viewableIndexList = useMemo(
    () =>
      data?.flatMap((_, index) => {
        const { length: itemWidth, offset: itemBegin } = getItemLayout(
          // @ts-expect-error
          data,
          index
        );
        const itemEnd = itemBegin + itemWidth;

        const adjustOffset = ((windowSize - 1) * containerWidth) / 2;

        const _containerBegin = focusIndex * itemWidth;
        const _containerEnd = _containerBegin + containerWidth;

        const containerBegin = _containerBegin - adjustOffset;
        const containerEnd = _containerEnd + adjustOffset;

        // prettier-ignore
        const canRenderTheBeginning = containerBegin <= itemBegin && itemBegin <= containerEnd;
        // prettier-ignore
        const canRenderTheEnd = containerBegin <= itemEnd && itemEnd <= containerEnd;

        return canRenderTheBeginning && canRenderTheEnd ? [index] : [];
      }) ?? [],
    [data, focusIndex, containerWidth, windowSize]
  );

  const listEmptyElement = useMemo(() => {
    if (!ListEmptyComponent) return null;
    return React.isValidElement(ListEmptyComponent) ? (
      ListEmptyComponent
    ) : (
      // @ts-expect-error
      <ListEmptyComponent />
    );
  }, [ListEmptyComponent]);

  return (
    <Focusable
      ref={containerRef}
      onBlur={onContainerBlured}
      onFocus={onContainerFocused}
      style={containerStyle}
      onLayout={onLayoutContainer}
    >
      {(focused) => (
        <>
          {isEmpty
            ? listEmptyElement
            : data?.map((item, index) => {
                // @ts-expect-error
                const itemLayout = getItemLayout(data, index);
                return viewableIndexList.includes(index) ? (
                  <Animated.View
                    key={index}
                    style={[
                      styles.absoluteContainer,
                      {
                        transform: [
                          {
                            translateX: animatedValue.interpolate({
                              inputRange: [0, dataLength - 1],
                              outputRange: [
                                itemLayout.offset,
                                itemLayout.length * -(dataLength - 1 - index),
                              ],
                            }),
                          },
                        ],
                        width: itemLayout.length,
                      },
                    ]}
                  >
                    {renderItem({
                      item,
                      index,
                      focused: containerFocused && index === focusIndex,
                    })}
                  </Animated.View>
                ) : null;
              }) ?? listEmptyElement}
          <>
            {FocusFrameComponent && (
              <View
                style={[
                  styles.absoluteContainer,
                  {
                    width: isEmpty
                      ? containerWidth
                      : // @ts-expect-error
                        getItemLayout(data, focusIndex).length,
                    height: containerHeight,
                  },
                ]}
                pointerEvents="none"
              >
                <FocusFrameComponent focused={focused} />
              </View>
            )}
          </>
        </>
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
