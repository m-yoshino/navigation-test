/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import { PrimaryScreen } from "../screens/PrimaryScreen";
import { SecondaryScreen } from "../screens/SecondaryScreen";
import { TertiaryScreen } from "../screens/TertiaryScreen";
import { RootStackParamList } from "../types";
import SideBarTabNavigator from "./SideBarTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import {
  onNavigationStateChange,
  onNavigatorReady,
  setTopLevelNavigator,
} from "./logging";

const Navigation: React.FC<{
  colorScheme: ColorSchemeName;
}> = ({ colorScheme }) => {
  return (
    <NavigationContainer
      ref={setTopLevelNavigator}
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      onStateChange={onNavigationStateChange}
      onReady={onNavigatorReady}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Primary" component={PrimaryScreen} />
      <Stack.Screen name="Secondary" component={SecondaryScreen} />
      <Stack.Screen name="Tertiary" component={TertiaryScreen} /> */}
      <Stack.Screen name="TabNavigator" component={SideBarTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
