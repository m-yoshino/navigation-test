import * as React from "react";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CommonFocusableCarousel } from "../components/CommonFocusableCarousel";
import { Text, View } from "../components/Themed";

const ITEM_SIZE = { width: 200, height: 100 };

export default function TabOneScreen() {
  const data = useMemo(() => {
    let [base, max, i] = [[] as string[], 100, 0];
    while (i++ < max) base.push(`${i}`);
    return base.flatMap((i) => base.map((ii) => `${i}:${ii}`));
  }, []);
  const onListElementPress = useCallback(
    (info) => console.log("onListElementPress", info),
    []
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tab One</Text>

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          getItemLayout={(_, index) => ({
            length: ITEM_SIZE.width,
            offset: ITEM_SIZE.width * index,
            index,
          })}
          containerHeight={ITEM_SIZE.height}
          data={[] as typeof data}
          onListElementPress={onListElementPress}
        />
      </View>
      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          getItemLayout={(_, index) => ({
            length: ITEM_SIZE.width,
            offset: ITEM_SIZE.width * index,
            index,
          })}
          containerHeight={ITEM_SIZE.height}
          data={data}
          onListElementPress={onListElementPress}
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
