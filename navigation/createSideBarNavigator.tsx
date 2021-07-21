import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { BottomTabNavigationConfig } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  NavigationHelpersContext,
  TabActions,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { Focusable } from "../components/Focusable";
import { FocusableView } from "../components/FocusableView";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { TVEvent, TV_EVENT_TYPE, useTVEvent } from "../hooks/useTVEvent";
import { SidebarTabNavigatorFocusContext } from "./SideBarTabNavigatorFocusContext";

const WIDTH_EXPAND_TAB = 100; // ラベルを表示する為の追加幅
const WIDTH_TAB_BASE = 50; // アイコンに合わせた幅

type Props = DefaultNavigatorOptions<BottomTabNavigationOptions> &
  TabRouterOptions &
  BottomTabNavigationConfig;

export function SideBarTabNavigator({
  initialRouteName,
  children,
  screenOptions,
}: Props) {
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  const tabRef = useRef<TouchableOpacity[]>([]);
  const onTabRef = useCallback(
    (index: number) => (r: TouchableOpacity | null) => {
      if (typeof r !== "undefined" && r !== null) {
        tabRef.current[index] = r;
      }
    },
    []
  );

  const [isFocusedTab, setFocusTabFlag] = useState(false);
  const selectedTabRef = useRef<TouchableOpacity | null>(null);
  const [selectedTabRefState, setSelectedTabRefState] =
    useState<React.RefObject<TouchableOpacity | null>>(selectedTabRef);
  useLayoutEffect(() => {
    selectedTabRef.current = tabRef.current[state.index];
    setSelectedTabRefState(selectedTabRef);
  }, [state.index]);

  const animatedValue = useAnimatedValue();
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocusedTab ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocusedTab]);

  const tvEventListener = useCallback((event: TVEvent) => {
    switch (event.eventType) {
      case TV_EVENT_TYPE.RIGHT: {
        setFocusTabFlag(false);
      }
    }
  }, []);
  useTVEvent(tvEventListener);

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            flexDirection: "column",
            flex: 0,
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [WIDTH_TAB_BASE, WIDTH_TAB_BASE + WIDTH_EXPAND_TAB],
            }),
          }}
        >
          {state.routes.map((route, index) => (
            <Focusable
              ref={onTabRef(index)}
              key={route.key}
              hasTVPreferredFocus={index === state.index}
              onFocus={() => {
                setFocusTabFlag(true);
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  navigation.dispatch({
                    ...TabActions.jumpTo(route.name),
                    target: state.key,
                  });
                }
              }}
              onPress={() => {
                setFocusTabFlag(false);
                tabRef.current.forEach((r) => {
                  r.blur();
                });
              }}
            >
              {(focused) => (
                <FocusableView focused={focused}>
                  <Pressable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        backgroundColor: index === state.index ? "red" : "gray",
                      }}
                    />
                    {isFocusedTab && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 30 + 16 * 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text>
                          {descriptors[route.key].options.title || route.name}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </FocusableView>
              )}
            </Focusable>
          ))}
        </Animated.View>
        <Animated.View
          style={{
            paddingLeft: WIDTH_TAB_BASE,
            flex: 1,
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, WIDTH_EXPAND_TAB],
                }),
              },
            ],
          }}
        >
          <SidebarTabNavigatorFocusContext.Provider
            value={{ ref: selectedTabRefState, isFocusedTab }}
          >
            {state.routes.map((route, i) => (
              <View
                key={route.key}
                style={[
                  {
                    flex: 1,
                  },
                  { display: i === state.index ? "flex" : "none" },
                ]}
              >
                {descriptors[route.key].render()}
              </View>
            ))}
          </SidebarTabNavigatorFocusContext.Provider>
        </Animated.View>
      </View>
    </NavigationHelpersContext.Provider>
  );
}

export const createSideBarTabNavigator =
  createNavigatorFactory(SideBarTabNavigator);
