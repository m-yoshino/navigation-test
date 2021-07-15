/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import TabOneSubScreen from "../screens/TabOneSubScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import * as types from "../types";
import { createSideBarTabNavigator } from "./createSideBarNavigator";

const SideBarTab = createSideBarTabNavigator<types.SideBarTabParamList>();

export default function SideBarTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <SideBarTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
      }}
    >
      <SideBarTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{}}
      />
      <SideBarTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{}}
      />
    </SideBarTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<types.TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: "Tab One Title" }}
      />
      <TabOneStack.Screen
        name="TabOneSubScreen"
        component={TabOneSubScreen}
        options={{ headerTitle: "Tab One Sub Title" }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<types.TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: "Tab Two Title" }}
      />
    </TabTwoStack.Navigator>
  );
}
