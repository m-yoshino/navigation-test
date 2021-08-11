import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Animated, Button, StyleSheet, TouchableOpacity } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Focusable } from "../components/Focusable";
import { FocusableCarousel } from "../components/FocusableCarousel";
import { FocusableView } from "../components/FocusableView";
import { Text, View } from "../components/Themed";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { useNextFocus } from "../hooks/useNextFocus";
import { useSideBarTabNavigatorFocusContext } from "../navigation/SideBarTabNavigatorFocusContext";
import { forceFocus } from "../util/forceFocus";

const FocusableCarouselItem = ({
  item,
  focused,
}: {
  item: string;
  focused: boolean;
}) => {
  const animatedValue = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [focused]);
  return (
    <Animated.View
      style={{
        width: "100%",
        height: "100%",
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
        backgroundColor: "gray",
        borderRadius: 2,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Text style={{ color: "#ffffff" }}>{item}</Text>
      </View>
    </Animated.View>
  );
};

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
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}
      {/* <Focusable ref={touchableRef} active={isFocused}>
        {(focused) => (
          <FocusableView focused={focused}>
            <EditScreenInfo path="/screens/TabOneScreen.tsx" />
          </FocusableView>
        )}
      </Focusable> */}

      {/* <Focusable ref={buttonRef} onPress={onPressButton}>
        {(focused) => (
          <FocusableView focused={focused} style={{ padding: 8 }}>
            <Button title="press" onPress={() => {}} />
          </FocusableView>
        )}
      </Focusable> */}

      {/* <Focusable ref={willFocusRef}>
        {(focused) => (
          <FocusableView focused={focused} style={{ padding: 8 }}>
            <Button title="will focus" onPress={() => {}} />
          </FocusableView>
        )}
      </Focusable> */}

      <View
        style={{ width: "100%", padding: 24, backgroundColor: "transparent" }}
      >
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
                backgroundColor: "transparent",
              }}
            >
              <FocusableCarouselItem item={item} focused={focused} />
            </View>
          )}
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
