import { useEffect, useRef } from "react";
// @ts-expect-error
import {TVEventHandler} from "react-native";

type EventKeyAction = 0 | 1 | -1;
export const TV_EVENT_TYPE = {
  BLUR: "blur",
  FOCUS: "focus",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;
export type TVEventType = typeof TV_EVENT_TYPE[keyof typeof TV_EVENT_TYPE];
// @TODO
export type TVEvent = {
  eventType: TVEventType;
  eventKeyAction: EventKeyAction;
  tag: number;
  dispatchConfig: {};
};


export const useTVEvent = (callback: (event: TVEvent) => void) => {
  const callbackRef = useRef<typeof callback | undefined>();
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // @ts-expect-error
    const listener = (_, event) => {
      callbackRef.current?.(event);
    };
    const eventHandler = new TVEventHandler();
    eventHandler.enable(null, listener);
    return () => {
      eventHandler.disable();
    };
  }, []);
};