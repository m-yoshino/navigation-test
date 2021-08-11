import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { Easing } from "react-native";
import {
  Animated,
  FlatListProps,
  ListRenderItemInfo,
  View,
} from "react-native";
import type { FocusableRef } from "../@types/tvos";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { useFocusableRef } from "../hooks/useFocusableRef";
import { useNextFocus } from "../hooks/useNextFocus";
import {
  TVEventListener,
  TV_EVENT_TYPE,
  useTVEvent,
} from "../hooks/useTVEvent";
import { forceFocus } from "../util/forceFocus";
import { Focusable } from "./Focusable";

export interface FocusableCarouselProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  nextFocusRight?: FocusableRef;
  nextFocusLeft?: FocusableRef;
  nextFocusUp?: FocusableRef;
  nextFocusDown?: FocusableRef;

  dimension: { width: number; height: number };
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
  dimension,
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

  const containerRef = useFocusableRef();
  useNextFocus(containerRef, {
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft: containerRef,
    nextFocusRight: containerRef,
  });

  const focusedFlagRef = useRef(false);
  const tvEventListener = useCallback<TVEventListener>(
    (event) => {
      if (!focusedFlagRef.current) {
        return;
      }
      switch (event.eventType) {
        case TV_EVENT_TYPE.LEFT: {
          if (focusIndex !== 0) {
            setFocusIndex(focusIndex - 1);
          } else if (nextFocusLeft) {
            forceFocus(nextFocusLeft);
          }
          break;
        }
        case TV_EVENT_TYPE.RIGHT: {
          if (focusIndex + 1 < dataLength) {
            setFocusIndex(focusIndex + 1);
          } else if (nextFocusRight) {
            forceFocus(nextFocusRight);
          }
          break;
        }
        case TV_EVENT_TYPE.SELECT: {
          onListElementPress?.({ item: data![focusIndex], index: focusIndex });
          break;
        }
      }
    },
    [data, focusIndex, nextFocusLeft, nextFocusRight, dataLength]
  );

  useTVEvent(tvEventListener);

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

  return (
    <Focusable
      ref={containerRef}
      style={{
        width: "100%",
        height: dimension.height,
      }}
    >
      {(focused) => {
        focusedFlagRef.current = focused;
        return (
          <View
            style={{
              position: "relative",
              width: "100%",
              height: dimension.height,
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                flexDirection: "row",
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, dataLength - 1],
                      outputRange: [0, -1 * (dataLength - 1) * dimension.width],
                    }),
                  },
                ],
              }}
            >
              {data?.map((item, index) => (
                <View key={index} style={{ ...dimension }}>
                  {renderItem({ item, index, focused: index === focusIndex })}
                </View>
              ))}
            </Animated.View>
            {FocusFrameComponent && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  ...dimension,
                  backgroundColor: "transparent",
                }}
                pointerEvents="none"
              >
                <FocusFrameComponent focused={focused} />
              </View>
            )}
          </View>
        );
      }}
    </Focusable>
  );
};
