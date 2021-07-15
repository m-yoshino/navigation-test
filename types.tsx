/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Primary: undefined;
  Secondary: undefined;
  Tertiary: undefined;
  TabNavigator: undefined;
  NotFound: undefined;
};

export type SideBarTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
  TabOneSubScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type NavigationRouteNames =
  | keyof RootStackParamList
  | keyof SideBarTabParamList
  | keyof TabOneParamList
  | keyof TabTwoParamList;

export type NavigationRouteParamsMap = NavigationRouteNames &
  RootStackParamList &
  SideBarTabParamList &
  TabOneParamList &
  TabTwoParamList;
