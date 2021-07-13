import type { NavigationState } from "@react-navigation/routers";
import {
  getPathFromState as getPathFromStateOrig,
  NavigationContainerRef,
} from "@react-navigation/native";
import navigationLinking from "./LinkingConfiguration";

function getPathFromState(state: ArgsType<typeof getPathFromStateOrig>[0]) {
  return getPathFromStateOrig(state, navigationLinking.config);
}
/**
 * for tracking
 */
let _currentPath: string = "/";
export const getCurrentPath = () => _currentPath;
const setCurrentPath = (path: string) => {
  _currentPath = path;
};

let _navigator: NavigationContainerRef;
export function setTopLevelNavigator(navigatorRef: NavigationContainerRef | null) {
  if (navigatorRef) {
    _navigator = navigatorRef;
  }
}

export function getNavigator(): NavigationContainerRef {
  return _navigator;
}

let prevRoutePath: string;
function setPrevState(pathname: string) {
  prevRoutePath = pathname;
}

// https://reactnavigation.org/docs/screen-tracking/
function getPrevPath(): string {
  return prevRoutePath;
}

export function onNavigatorReady() {
  setPrevState(getPathFromState(getNavigator().getRootState()));
}
export function onNavigationStateChange(currentState: NavigationState | undefined) {
  if (currentState === undefined) {
    if (__DEV__) {
      console.warn("[onNavigationStateChange] currentState is `undefined`");
    }
    return;
  }
  const currentPath = getPathFromState(currentState);
  loggingChangeNavigationState(currentPath);
  setPrevState(currentPath);
}

function loggingChangeNavigationState(currentPath: string) {
  const _prevRoutePath = getPrevPath();
  try {
    if (_prevRoutePath !== currentPath) {
      loggingCurrentPath(currentPath);
      setReferrer(_prevRoutePath);
    }
  } catch (error) {
    console.error(error);
  }
}

function loggingCurrentPath(path: string) {
  if (__DEV__) {
    console.log("[loggingCurrentPath]:", path);
  }
  setCurrentPath(path);
  console.log("app_change_location", { content_type: "pathname", item_id: path });
}

function setReferrer(prevPath: string | undefined) {
  if (prevPath) {
    console.log("referrer_url", prevPath);
  }
}
