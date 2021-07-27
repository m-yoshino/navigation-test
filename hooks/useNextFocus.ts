import * as React from "react";
import {
  findNodeHandle,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

type Touchable = TouchableOpacity | TouchableHighlight;
type RefObject = React.MutableRefObject<Touchable | null>;

export const useNextFocus = (
  ref: RefObject,
  {
    nextFocusUp: up,
    nextFocusDown: down,
    nextFocusLeft: left,
    nextFocusRight: right,
  }: {
    nextFocusUp?: RefObject | null;
    nextFocusDown?: RefObject | null;
    nextFocusLeft?: RefObject | null;
    nextFocusRight?: RefObject | null;
  }
) => {
  const selfHandle = findNodeHandle(ref.current);
  React.useEffect(() => {
    ref.current?.setNativeProps({
      nextFocusUp: up === null ? selfHandle : up ? findNodeHandle(up.current) : undefined,
      nextFocusDown: down === null ? selfHandle : down ? findNodeHandle(down.current) : undefined,
      nextFocusLeft: left === null ? selfHandle : left ? findNodeHandle(left.current) : undefined,
      nextFocusRight: right === null ? selfHandle : right ? findNodeHandle(right.current) : undefined,
    });
  }, [ref.current, up?.current, down?.current, left?.current, right?.current]);
};
