import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Focusable } from "../components/Focusable";
import { FocusableView } from "../components/FocusableView";
import { Text, View } from "../components/Themed";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";

export default function TabOneScreen() {
  const lastFocusedTabRef = useSideBarTabNavigatorFocusContext();

  const touchableRef = React.useRef<TouchableOpacity>(null);
  useNextFocus(touchableRef, { left: lastFocusedTabRef?.ref });
  const isFocused = useIsFocused();
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
