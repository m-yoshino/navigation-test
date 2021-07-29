import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { useCallback, useRef } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Focusable } from "../components/Focusable";
import { FocusableList, FocusableListProps } from "../components/FocusableList";
import { FocusableView } from "../components/FocusableView";
import { Text, View } from "../components/Themed";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";

const itemWidth = 100;
const data = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
];

export default function TabThreeScreen() {
  const { ref: lastFocusedTabRef } = useSideBarTabNavigatorFocusContext();
  const touchableRef = React.useRef<TouchableOpacity>(null);
  useNextFocus(touchableRef, {
    nextFocusUp: null,
    nextFocusLeft: lastFocusedTabRef,
  });
  const isFocused = useIsFocused();

  const renderItem = useCallback<FocusableListProps<string>["renderItem"]>(
    ({ focused, index, item }) => {
      return (
        <FocusableView
          focused={focused}
          style={{ padding: 8, width: itemWidth }}
        >
          <Text>item: {item}</Text>
          <Text>index: {index}</Text>
          <Text>focused: {focused ? "true" : "false"}</Text>
        </FocusableView>
      );
    },
    []
  );

  const listRef = useRef<FlatList>(null);

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

  const getItemLayout = useCallback<
    NonNullable<FocusableListProps<string>["getItemLayout"]>
  >(
    (_, index) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    []
  );

  return (
    <>
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
      </View>
      <FocusableList
        nextFocusLeft={touchableRef}
        horizontal
        listRef={listRef}
        data={data}
        renderItem={renderItem}
        onListElementFocus={onListElementFocus}
        onListElementBlur={onListElementBlur}
        onListElementPress={onListElementPress}
        keyExtractor={(item) => item}
        getItemLayout={getItemLayout}
      />
    </>
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
