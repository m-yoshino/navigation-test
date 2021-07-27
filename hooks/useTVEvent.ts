import { useEffect, useRef } from "react";
// @see https://github.com/facebook/react-native/issues/31343
// @ts-expect-error
import { TVEventHandler } from "react-native";

export const TV_EVENT_KEY_ACTION = {
  ACTION_DOWN: 0,
  ACTION_UP: 1,
} as const;
type EventKeyAction =
  typeof TV_EVENT_KEY_ACTION[keyof typeof TV_EVENT_KEY_ACTION];

export const TV_EVENT_TYPE = {
  BLUR: "blur",
  FOCUS: "focus",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  SELECT: "select",
  PLAY_PAUSE: "playPause",
  REWIND: "rewind",
  FAST_FORWARD: "fastForward",
  STOP: "stop",
  NEXT: "next",
  PREVIOUS: "previous",
  INFO: "info",
  MENU: "menu",
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
    const listener = (_: unknown, event: TVEvent) => {
      callbackRef.current?.(event);
    };
    const eventHandler = new TVEventHandler();
    eventHandler.enable(null, listener);
    return () => {
      eventHandler.disable();
    };
  }, []);
};
