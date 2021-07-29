import React, { useCallback, useEffect, useMemo } from "react";
import { useRef } from "react";
import { ListRenderItemInfo, TouchableOpacity } from "react-native";
import { FlatList, FlatListProps } from "react-native";
import { useNextFocus } from "../hooks/useNextFocus";
import {
  Focusable,
  FocusableProps,
  FocusableRef,
  forceFocus,
} from "./Focusable";

export interface FocusableListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  listRef?: React.RefObject<FlatList>;

  onListElementFocus?: (
    element: FocusableRef,
    info: ListRenderItemInfo<ItemT>
  ) => void;
  onListElementBlur?: (
    element: FocusableRef,
    info: ListRenderItemInfo<ItemT>
  ) => void;
  onListElementPress?: (
    element: FocusableRef,
    info: ListRenderItemInfo<ItemT>
  ) => void;

  focusableItemProps?: Partial<FocusableProps>;

  nextFocusRight?: FocusableRef;
  nextFocusLeft?: FocusableRef;
  nextFocusUp?: FocusableRef;
  nextFocusDown?: FocusableRef;

  renderItem: (
    info: ListRenderItemInfo<ItemT> & { focused: boolean }
  ) => React.ReactNode;
}

export const FocusableList = <ItemT extends unknown>({
  listRef,
  data,
  focusableItemProps,
  renderItem: _renderItem,
  onListElementFocus: _onListElementFocus,
  onListElementBlur,
  onListElementPress,
  nextFocusRight,
  nextFocusLeft,
  nextFocusUp,
  nextFocusDown,
  ...rest
}: FocusableListProps<ItemT>) => {
  const itemRef = React.useRef<
    React.MutableRefObject<TouchableOpacity | null>[]
  >([]);
  const onItemRef = useCallback((r: TouchableOpacity, index: number) => {
    if (typeof itemRef.current[index] === "undefined") {
      itemRef.current[index] = React.createRef<TouchableOpacity | null>();
    }
    if (r) itemRef.current[index].current = r;
  }, []);

  const lastFocusedItemRef = useRef<TouchableOpacity | null>(
    itemRef.current[0]?.current
  );
  const onFocusContainer = useCallback(() => {
    forceFocus(lastFocusedItemRef);
  }, []);

  useEffect(() => {
    if (!lastFocusedItemRef.current) {
      lastFocusedItemRef.current = itemRef.current[0].current;
    }
  }, []);

  const onListElementFocus = useCallback<
    NonNullable<typeof _onListElementFocus>
  >(
    (element, info) => {
      lastFocusedItemRef.current = element.current;
      _onListElementFocus?.(element, info);
    },
    [_onListElementFocus]
  );

  const renderItem = useCallback<
    NonNullable<FlatListProps<ItemT>["renderItem"]>
  >(
    (props) => (
      <FocusableListItem
        isHorizontal={!!rest.horizontal}
        dataLength={data?.length ?? 0}
        itemRef={itemRef}
        onItemRef={onItemRef}
        onListElementFocus={onListElementFocus}
        onListElementBlur={onListElementBlur}
        onListElementPress={onListElementPress}
        nextFocusLeft={nextFocusLeft}
        nextFocusRight={nextFocusRight}
        nextFocusUp={nextFocusUp}
        nextFocusDown={nextFocusDown}
        {...props}
        {...focusableItemProps}
      >
        {(focused) => _renderItem?.({ ...props, focused })}
      </FocusableListItem>
    ),
    [
      _renderItem,
      onListElementFocus,
      onListElementBlur,
      onListElementPress,
      focusableItemProps,
    ]
  );

  return (
    <Focusable style={{ flex: 1 }} onFocus={onFocusContainer}>
      {(_) => (
        <FlatList ref={listRef} data={data} renderItem={renderItem} {...rest} />
      )}
    </Focusable>
  );
};

const FocusableListItem = <ItemT extends unknown>({
  index,
  item,
  separators,
  itemRef,
  onItemRef,
  onListElementFocus,
  onListElementBlur,
  onListElementPress,
  nextFocusRight,
  nextFocusLeft,
  nextFocusUp,
  nextFocusDown,
  isHorizontal,
  dataLength,
  children,
  ...rest
}: ListRenderItemInfo<ItemT> &
  Pick<
    FocusableListProps<ItemT>,
    | "onListElementFocus"
    | "onListElementBlur"
    | "onListElementPress"
    | "nextFocusRight"
    | "nextFocusLeft"
    | "nextFocusUp"
    | "nextFocusDown"
  > & {
    itemRef: React.MutableRefObject<
      React.MutableRefObject<TouchableOpacity | null>[]
    >;
    onItemRef: (ref: TouchableOpacity, index: number) => void;
    isHorizontal: boolean;
    dataLength: number;
  } & FocusableProps) => {
  const selfRef = useRef<TouchableOpacity | null>(null);
  const onRef = useCallback(
    (ref: TouchableOpacity) => {
      selfRef.current = ref;
      onItemRef(ref, index);
    },
    [onItemRef]
  );

  const onFocus = useCallback(
    () => onListElementFocus?.(selfRef, { index, item, separators }),
    [onListElementFocus, index, item, separators]
  );

  const onBlur = useCallback(
    () => onListElementBlur?.(selfRef, { index, item, separators }),
    [onListElementBlur, index, item, separators]
  );

  const onPress = useCallback(
    () => onListElementPress?.(selfRef, { index, item, separators }),
    [onListElementPress, index, item, separators]
  );

  const nextFocus = useMemo(() => {
    if (isHorizontal) {
      return {
        nextFocusLeft: index === 0 ? nextFocusLeft : undefined,
        nextFocusRight: dataLength === index + 1 ? nextFocusRight : undefined,
        nextFocusUp,
        nextFocusDown,
      };
    }
    return {
      nextFocusUp: index === 0 ? nextFocusUp : undefined,
      nextFocusDown: dataLength === index + 1 ? nextFocusDown : undefined,
      nextFocusLeft,
      nextFocusRight,
    };
  }, [
    isHorizontal,
    index,
    dataLength,
    nextFocusLeft,
    nextFocusRight,
    nextFocusUp,
    nextFocusDown,
  ]);

  useNextFocus(selfRef, nextFocus);

  return (
    <Focusable
      ref={onRef}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      children={children}
      {...rest}
    />
  );
};
