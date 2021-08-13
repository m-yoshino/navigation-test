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

export interface FocusableCarouselProps<ItemT>
  extends Pick<FlatListProps<ItemT>, "data" | "ListEmptyComponent"> {
  nextFocusRight?: FocusableRef;
  nextFocusLeft?: FocusableRef;
  nextFocusUp?: FocusableRef;
  nextFocusDown?: FocusableRef;

  itemSize: { width: number; height: number };
  animationConfig?: Pick<Animated.TimingAnimationConfig, "duration" | "easing">;

  FocusFrameComponent?: React.ComponentType<{ focused: boolean }>;

  windowSize?: number;

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
  ListEmptyComponent,
  windowSize = DEFAULT_WINDOW_SIZE,
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

  const { width: containerWidth, onLayout: onLayoutContainer } = useLayout();

  const viewableIndexList = useMemo(() => {
    return (
      data?.flatMap((_, index) => {
        const itemWidth = itemSize.width;

        const itemBegin = index * itemWidth;
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
      }) ?? []
    );
  }, [data, itemSize, focusIndex, containerWidth, windowSize]);

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
            : data?.map((item, index) =>
                viewableIndexList.includes(index) ? (
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
                                itemSize.width * index,
                                itemSize.width * -(dataLength - 1 - index),
                              ],
                            }),
                          },
                        ],
                        ...itemSize,
                      },
                    ]}
                  >
                    {renderItem({
                      item,
                      index,
                      focused: containerFocused && index === focusIndex,
                    })}
                  </Animated.View>
                ) : null
              ) ?? listEmptyElement}
          <>
            {FocusFrameComponent && (
              <View
                style={[
                  styles.absoluteContainer,
                  {
                    width: isEmpty ? containerWidth : itemSize.width,
                    height: itemSize.height,
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
