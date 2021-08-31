import * as React from "react";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { FocusableCarousel } from "../components/FocusableCarousel";
import { FocusableCarouselProps } from "../components/FocusableCarousel/types";
import { Text, View } from "../components/Themed";

const ITEM_SIZE = { width: 200, height: 100 };

export default function TabOneScreen() {
  const data = useMemo(() => {
    let [base, max, i] = [[] as string[], 10, 0];
    while (i++ < max) base.push(`${i}`);
    return base.flatMap((i) => base.map((ii) => `${i}:${ii}`));
  }, []);

  const onListElementPress = useCallback(
    (info) => console.log("onListElementPress", info),
    []
  );

  const renderItem = useCallback<FocusableCarouselProps<string>["renderItem"]>(
    ({ item }) => (
      <View
        style={{
          ...ITEM_SIZE,
          backgroundColor: "red",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback<
    FocusableCarouselProps<string>["keyExtractor"]
  >((item) => item, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tab One</Text>

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <FocusableCarousel
          data={data}
          itemSize={ITEM_SIZE}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
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
