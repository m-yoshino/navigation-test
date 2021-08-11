import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { useCallback } from "react";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Focusable } from "../components/Focusable";
import { FocusableCarousel } from "../components/FocusableCarousel";
import { FocusableView } from "../components/FocusableView";
import { Text, View } from "../components/Themed";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";
import { forceFocus } from "../util/forceFocus";

export default function TabOneScreen() {
  const lastFocusedTabRef = useSideBarTabNavigatorFocusContext();

  const touchableRef = React.useRef<TouchableOpacity>(null);
  useNextFocus(touchableRef, {
    nextFocusLeft: lastFocusedTabRef?.ref,
    nextFocusUp: null,
  });
  const isFocused = useIsFocused();

  const buttonRef = React.useRef<TouchableOpacity>(null);
  const willFocusRef = React.useRef<TouchableOpacity>(null);
  const onPressButton = useCallback(() => {
    forceFocus(willFocusRef);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Focusable ref={touchableRef} active={isFocused}>
        {(focused) => (
          <FocusableView focused={focused}>
            <EditScreenInfo path="/screens/TabOneScreen.tsx" />
          </FocusableView>
        )}
      </Focusable>

      <Focusable ref={buttonRef} onPress={onPressButton}>
        {(focused) => (
          <FocusableView focused={focused} style={{ padding: 8 }}>
            <Button title="press" onPress={() => {}} />
          </FocusableView>
        )}
      </Focusable>

      <Focusable ref={willFocusRef}>
        {(focused) => (
          <FocusableView focused={focused} style={{ padding: 8 }}>
            <Button title="will focus" onPress={() => {}} />
          </FocusableView>
        )}
      </Focusable>

      <FocusableCarousel
        dimension={{ width: 200, height: 100 }}
        data={["001", "002", "003", "004", "005", "006"]}
        onListElementPress={(info) => console.log("onListElementPress", info)}
        renderItem={({ item, focused }) => (
          <View
            style={{
              width: 200,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: focused ? 1 : 1 }],
            }}
          >
            <Text>{item}</Text>
          </View>
        )}
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
