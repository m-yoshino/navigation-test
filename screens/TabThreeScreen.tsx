import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Focusable } from "../components/Focusable";
import { FocusableList, FocusableListProps } from "../components/FocusableList";
import { FocusableView } from "../components/FocusableView";
import { Text, View } from "../components/Themed";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";

export default function TabThreeScreen() {
  const lastFocusedTabRef = useSideBarTabNavigatorFocusContext();
  const touchableRef = React.useRef<TouchableOpacity>(null);
  useNextFocus(touchableRef, { left: lastFocusedTabRef?.ref });
  const isFocused = useIsFocused();

  const renderItem = useCallback<FocusableListProps<string>["renderItem"]>(
    ({ focused, index, item }) => {
      return (
        <FocusableView focused={focused} style={{ padding: 8 }}>
          <Text>item: {item}</Text>
          <Text>index: {index}</Text>
          <Text>focused: {focused ? "true" : "false"}</Text>
        </FocusableView>
      );
    },
    []
  );

  const onListElementFocus = useCallback<
    NonNullable<FocusableListProps<string>["onListElementFocus"]>
  >((element, info) => {
    console.log("onListElementFocus", { element, info });
  }, []);

  const onListElementBlur = useCallback<
    NonNullable<FocusableListProps<string>["onListElementBlur"]>
  >((element, info) => {
    console.log("onListElementBlur", { element, info });
  }, []);

  const onListElementPress = useCallback<
    NonNullable<FocusableListProps<string>["onListElementPress"]>
  >((element, info) => {
    // @see https://github.com/facebook/react-native/issues/27937
    console.log("onListElementPress", { element, info });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Focusable ref={touchableRef} active={isFocused}>
        {(focused) => (
          <FocusableView focused={focused}>
            <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
          </FocusableView>
        )}
      </Focusable>
      <FocusableList
        data={["hoge", "fuga", "piyo", "one", "two", "three"]}
        renderItem={renderItem}
        onListElementFocus={onListElementFocus}
        onListElementBlur={onListElementBlur}
        onListElementPress={onListElementPress}
        keyExtractor={(item) => item}
      />
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
