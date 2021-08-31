import * as React from "react";
import { useCallback, useMemo } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { FakeCarousel } from "../components/FakeCarousel";
import type { FakeCarouselProps } from "../components/FakeCarousel/types";
import { Text, View } from "../components/Themed";
import { useBool } from "../hooks/useBool";

const ITEM_SIZE = { width: 200, height: 100 };

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
        <Text>{item}</Text>
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback<FakeCarouselProps<string>["keyExtractor"]>(
    (item) => item,
    []
  );

  const { bool: focused, setTrue: onFocus, setFalse: onBlur } = useBool(false);

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
            data={data}
            itemSize={ITEM_SIZE}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onSelectElement={onSelectElement}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {focused && (
            <View
              style={{
                position: "absolute",
                ...ITEM_SIZE,
                borderWidth: 2,
                borderColor: "white",
                backgroundColor: "transparent",
              }}
            />
          )}
        </View>
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
