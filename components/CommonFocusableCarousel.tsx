import React from "react";
import { useEffect } from "react";
import { Animated, View, Text } from "react-native";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { FocusableCarousel, FocusableCarouselProps } from "./FocusableCarousel";

const FocusableCarouselItem = <ItemT extends unknown>({
  item,
  focused,
}: {
  item: ItemT;
  focused: boolean;
}) => {
  const animatedValue = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [focused]);
  return (
    <Animated.View
      style={{
        width: "100%",
        height: "100%",
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
        backgroundColor: "gray",
        borderRadius: 2,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Text style={{ color: "#ffffff" }}>{String(item)}</Text>
      </View>
    </Animated.View>
  );
};

export const CommonFocusableCarousel = <ItemT extends unknown>({
  ...rest
}: Omit<
  FocusableCarouselProps<ItemT>,
  "renderItem" | "FocusFrameComponent"
>) => (
  <FocusableCarousel
    {...rest}
    renderItem={({ item, focused }) => (
      <View
        style={{
          width: 200,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <FocusableCarouselItem item={item} focused={focused} />
      </View>
    )}
    ListEmptyComponent={() => (
      <View
        style={{
          paddingLeft: 16,
          width: "100%",
          height: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <Text style={{ color: "white" }}>データがありません</Text>
      </View>
    )}
    FocusFrameComponent={({ focused }) =>
      focused ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 4,
            backgroundColor: "transparent",
          }}
        />
      ) : null
    }
  />
);
