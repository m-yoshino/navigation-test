import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { CommonFocusView, Focusable } from "../components/Focusable";
import { Text, View } from "../components/Themed";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";

export default function TabThreeScreen() {
  const lastFocusedTabRef = useSideBarTabNavigatorFocusContext();
  const touchableRef = React.useRef<TouchableOpacity>(null);
  useNextFocus(touchableRef, { left: lastFocusedTabRef?.ref });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Focusable ref={touchableRef}>
        <CommonFocusView>
          <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
        </CommonFocusView>
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
