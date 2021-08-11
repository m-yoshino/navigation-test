import * as React from "react";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { CommonFocusableCarousel } from "../components/CommonFocusableCarousel";
import { Text, View } from "../components/Themed";

export default function TabOneScreen() {
  const data = useMemo(() => ["001", "002", "003", "004", "005", "006"], []);
  const dimension = useMemo(() => ({ width: 200, height: 100 }), []);
  const onListElementPress = useCallback(
    (info) => console.log("onListElementPress", info),
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
        <CommonFocusableCarousel
          dimension={dimension}
          data={data}
          onListElementPress={onListElementPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
