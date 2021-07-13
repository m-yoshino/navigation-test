import type { NavigationAction, NavigationState } from "@react-navigation/core";
import { StackActions, CommonActions } from "@react-navigation/native";
import type { NavigationRouteNames, NavigationRouteParamsMap } from "../types";
import { getNavigator } from "./logging";

export const getUniqueId = (() => {
  let count = 0;
  return () => count++;
})();
const getUniqueKey = () => String(getUniqueId());
export function dispatchNavigation(
  action: NavigationAction | ((state: NavigationState) => NavigationAction),
) {
  getNavigator().dispatch(action);
}

export function getCurrentScreenName(): string | undefined {
  if (__DEV__) {
    const screenName = getNavigator().getCurrentRoute()?.name;
    console.log("[getCurrentScreenName]", screenName);
    return screenName;
  }
  return getNavigator().getCurrentRoute()?.name;
}

export function navigate<T extends NavigationRouteNames>(
  name: T,
  params?: NavigationRouteParamsMap[T],
) {
  if (__DEV__) {
    console.debug("[navigationService.navigate]", name, params);
  }
  getNavigator().dispatch(CommonActions.navigate({ name, params }));
}

export function reset(options: ArgsType<typeof CommonActions.reset>[0]) {
  getNavigator().dispatch(CommonActions.reset(options));
}

export function push<T extends NavigationRouteNames>(
  name: T,
  params?: NavigationRouteParamsMap[T],
) {
  getNavigator().dispatch(StackActions.push(name, params));
}

export function goBack() {
  handleGoBack();
}

export function handleGoBack(key?: string) {
  if (getNavigator()) {
    getNavigator().dispatch({
      ...CommonActions.goBack(),
      target: key,
    });
  }
}

export function replace<T extends NavigationRouteNames>(
  routeName: T,
  params?: NavigationRouteParamsMap[T],
) {
  getNavigator().dispatch(
    StackActions.replace(routeName, params),
  );
}

export function go(num: number) {
  getNavigator().dispatch(StackActions.pop(num));
}

export function popToTop() {
  getNavigator().dispatch(StackActions.popToTop());
}
