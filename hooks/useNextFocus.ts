import * as React from 'react';
import { findNodeHandle, TouchableHighlight, TouchableOpacity } from "react-native"

type Touchable = TouchableOpacity | TouchableHighlight;
type RefObject = React.RefObject<Touchable | null>;

export const useNextFocus = (ref: RefObject, {up, down, left, right}: {up?: RefObject, down?: RefObject, left?: RefObject, right?: RefObject}) => {
  React.useEffect(() => {
    ref.current?.setNativeProps({
      nextFocusUp: up ? findNodeHandle(up.current) : undefined,
      nextFocusDown: down ? findNodeHandle(down.current) : undefined,
      nextFocusLeft: left ? findNodeHandle(left.current) : undefined,
      nextFocusRight: right ? findNodeHandle(right.current) : undefined,
    });
  }, [ref.current, up?.current, down?.current, left?.current, right?.current]);
};