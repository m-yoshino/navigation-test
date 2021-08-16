import * as React from "react";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { FocusableKeyboardView } from "../components/FocusableKeyboardView";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [inputText, setInputText] = useState("");
  const onChangeText = useCallback((callback: (str: string) => string) => {
    setInputText(callback);
  }, []);
  return (
    <View style={styles.container}>
      <FocusableKeyboardView value={inputText} onChangeText={onChangeText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
