import * as React from "react";
import { StyleSheet } from "react-native";
import { FocusableKeyboardView } from "../components/FocusableKeyboardView";
import { View } from "../components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <FocusableKeyboardView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    alignItems: "flex-start",
    justifyContent: "center",
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
