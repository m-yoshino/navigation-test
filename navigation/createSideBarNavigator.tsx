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
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { CommonFocusView, Focusable } from "../components/Focusable";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { sleep } from "../util/sleep";
import { SidebarTabNavigatorFocusContext } from "./SideBarTabNavigatorFocusContext";

const WIDTH_EXPAND_TAB = 100;
const WIDTH_TAB_BASE = 50;

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

  const selectedTabRef = useRef<TouchableOpacity | null>(null);
  const [focusContextValue, setFocusContextValue] = useState<{
    ref: React.RefObject<TouchableOpacity | null>;
  }>({
    ref: selectedTabRef,
  });
  useEffect(() => {
    selectedTabRef.current = tabRef.current[state.index];
    setFocusContextValue({ ref: selectedTabRef });
  }, [state.index]);

  const [isFocusTabInternalFlag, setFocusTabInternalFlag] = useState(false);
  const onFocus = useCallback(() => setFocusTabInternalFlag(true), []);
  const onBlur = useCallback(() => setFocusTabInternalFlag(false), []);

  const [isFocusTab, setFocusTabFlag] = useState(false);
  useEffect(() => {
    let canceled = false;
    const effect = async () => {
      if (!isFocusTabInternalFlag) {
        await sleep(50);
      }
      if (!canceled) {
        setFocusTabFlag(isFocusTabInternalFlag);
      }
    };
    effect();
    return () => {
      canceled = true;
    };
  }, [isFocusTabInternalFlag]);

  const animatedValue = useAnimatedValue();
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocusTab ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocusTab]);

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
              onFocus={onFocus}
              onBlur={onBlur}
              onPress={() => {
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
            >
              <CommonFocusView>
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
                  {isFocusTab && (
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
              </CommonFocusView>
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
          <SidebarTabNavigatorFocusContext.Provider value={focusContextValue}>
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
