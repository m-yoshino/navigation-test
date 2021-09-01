import * as React from "react";
import { useCallback, useMemo } from "react";
import { Animated, ScrollView, StyleSheet, Image } from "react-native";
import { FakeCarousel } from "../components/FakeCarousel";
import type { FakeCarouselProps } from "../components/FakeCarousel/types";
import { Text, View } from "../components/Themed";
import { useBool } from "../hooks/useBool";
import sampleImage from "../assets/images/sample.png";
import { useLayout } from "../hooks/useLayout";

const ITEM_SIZE = { width: 600, height: 300 };

export default function TabOneScreen() {
  const data = useMemo(() => {
    let [base, max, i] = [[] as string[], 10, 0];
    while (i++ < max) base.push(`${i}`);
    return base.flatMap((i) => base.map((ii) => `${i}:${ii}`));
  }, []);

  const onSelectElement = useCallback<
    NonNullable<FakeCarouselProps<string>["onSelectElement"]>
  >(({ item, index }) => console.log("onSelectElement", { item, index }), []);

  const renderItem = useCallback<FakeCarouselProps<string>["renderItem"]>(
    ({ item, animated }) => (
      <Animated.View
        style={{
          ...ITEM_SIZE,
          backgroundColor: "red",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          opacity: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
            extrapolate: "clamp",
          }),
          transform: [
            {
              scale: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <Animated.Image
          source={sampleImage}
          style={ITEM_SIZE}
          blurRadius={animated.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 0],
            extrapolate: "clamp",
          })}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{item}</Text>
        </View>
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback<FakeCarouselProps<string>["keyExtractor"]>(
    (item) => item,
    []
  );

  const { bool: focused, setTrue: onFocus, setFalse: onBlur } = useBool(false);
  const { width: containerWidth, onLayout: onContainerLayout } = useLayout();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tab One</Text>

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <View
          style={{
            backgroundColor: "transparent",
          }}
        >
          <FakeCarousel
            onLayout={onContainerLayout}
            data={data}
            itemSize={ITEM_SIZE}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onSelectElement={onSelectElement}
            onFocus={onFocus}
            onBlur={onBlur}
            align="center"
          />
          {focused && (
            <View
              style={{
                position: "absolute",
                top: -4,
                left: -4 + containerWidth / 2 - ITEM_SIZE.width / 2,
                width: ITEM_SIZE.width + 8,
                height: ITEM_SIZE.height + 8,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "white",
                backgroundColor: "transparent",
              }}
            />
          )}
        </View>
      </View>

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <FakeCarousel
          data={data}
          itemSize={{ width: 200, height: 100 }}
          renderItem={({ item }) => (
            <View
              style={{
                ...{ width: 200, height: 100 },
                backgroundColor: "gray",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={keyExtractor}
          onSelectElement={onSelectElement}
          align="flex-start"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
