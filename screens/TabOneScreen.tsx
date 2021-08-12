import * as React from "react";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CommonFocusableCarousel } from "../components/CommonFocusableCarousel";
import { Text, View } from "../components/Themed";

export default function TabOneScreen() {
  const data = useMemo(() => ["001", "002", "003", "004", "005", "006"], []);
  const itemSize = useMemo(() => ({ width: 200, height: 100 }), []);
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
          itemSize={itemSize}
          data={data}
          onListElementPress={onListElementPress}
        />
      </View>
      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          itemSize={itemSize}
          data={data}
          onListElementPress={onListElementPress}
        />
      </View>
      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          itemSize={itemSize}
          data={data}
          onListElementPress={onListElementPress}
        />
      </View>
      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          itemSize={itemSize}
          data={data}
          onListElementPress={onListElementPress}
        />
      </View>
      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          itemSize={itemSize}
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
