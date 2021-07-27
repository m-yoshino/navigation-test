import React, { useCallback } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { ListRenderItemInfo, TouchableOpacity } from "react-native";
import { FlatList, FlatListProps } from "react-native";
import { useNextFocus } from "../hooks/useNextFocus";
import { Focusable, FocusableProps } from "./Focusable";

export interface FocusableListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  listRef?: React.RefObject<FlatList>;

  onListElementFocus?: (
    element: React.RefObject<unknown>,
    info: { item: ItemT; index: number }
  ) => void;
  onListElementBlur?: (
    element: React.RefObject<unknown>,
    info: { item: ItemT; index: number }
  ) => void;
  onListElementPress?: (
    element: React.RefObject<unknown>,
    info: { item: ItemT; index: number }
  ) => void;

  focusableItemProps?: Partial<FocusableProps>;

  renderItem: (
    info: ListRenderItemInfo<ItemT> & { focused: boolean }
  ) => React.ReactNode;
}

export const FocusableList = <ItemT extends unknown>({
  listRef,
  data,
  focusableItemProps,
  renderItem: _renderItem,
  onListElementFocus,
  onListElementBlur,
  onListElementPress,
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

  const renderItem = useCallback<
    NonNullable<FlatListProps<ItemT>["renderItem"]>
  >(
    (props) => (
      <FocusableListItem
        itemRef={itemRef}
        onItemRef={onItemRef}
        isHorizontal={!!rest.horizontal}
        onListElementFocus={onListElementFocus}
        onListElementBlur={onListElementBlur}
        onListElementPress={onListElementPress}
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
    <FlatList
      ref={listRef}
      data={data}
      renderItem={renderItem}
      extraData={itemRef.current.join(",")}
      {...rest}
    />
  );
};

const FocusableListItem = <ItemT extends unknown>({
  index,
  item,
  separators,
  itemRef,
  onItemRef,
  isHorizontal,
  onListElementFocus,
  onListElementBlur,
  onListElementPress,
  children,
  nextFocusDown,
  nextFocusUp,
  nextFocusLeft,
  nextFocusRight,
  ...rest
}: ListRenderItemInfo<ItemT> &
  Pick<
    FocusableListProps<ItemT>,
    "onListElementFocus" | "onListElementBlur" | "onListElementPress"
  > & {
    itemRef: React.MutableRefObject<
      React.MutableRefObject<TouchableOpacity | null>[]
    >;
    onItemRef: (ref: TouchableOpacity, index: number) => void;
    isHorizontal: boolean;
  } & FocusableProps) => {
  const selfRef = useRef<TouchableOpacity | null>(null);
  const onRef = useCallback(
    (ref: TouchableOpacity) => {
      selfRef.current = ref;
      onItemRef(ref, index);
    },
    [onItemRef]
  );

  const nextFocus = useMemo(() => {
    const override = {
      nextFocusDown: nextFocusDown?.current ? nextFocusDown : undefined,
      nextFocusUp: nextFocusUp?.current ? nextFocusUp : undefined,
      nextFocusLeft: nextFocusLeft?.current ? nextFocusLeft : undefined,
      nextFocusRight: nextFocusRight?.current ? nextFocusRight : undefined,
    };
    const selfHandle = selfRef.current ? selfRef : undefined;
    const forwardRef = itemRef.current?.[index + 1];
    const backwardRef = itemRef.current?.[index - 1];
    const forwardHandle =
      forwardRef && forwardRef.current ? forwardRef : undefined;
    const backwardHandle =
      backwardRef && backwardRef.current ? backwardRef : undefined;
    if (isHorizontal) {
      return {
        nextFocusRight: forwardHandle
          ? forwardHandle
          : override?.nextFocusRight ?? selfHandle,
        nextFocusLeft: backwardHandle
          ? backwardHandle
          : override?.nextFocusLeft ?? selfHandle,
        nextFocusUp: override?.nextFocusUp ?? selfHandle,
        nextFocusDown: override?.nextFocusDown ?? selfHandle,
      };
    }
    return {
      nextFocusDown: forwardHandle
        ? forwardHandle
        : override?.nextFocusDown ?? selfHandle,
      nextFocusUp: backwardHandle
        ? backwardHandle
        : override?.nextFocusUp ?? selfHandle,
      nextFocusLeft: override?.nextFocusLeft ?? selfHandle,
      nextFocusRight: override?.nextFocusRight ?? selfHandle,
    };
  }, [
    isHorizontal,
    index,
    itemRef.current.join(","),
    selfRef.current,
    nextFocusDown,
    nextFocusUp,
    nextFocusLeft,
    nextFocusRight,
  ]);

  useNextFocus(selfRef, nextFocus);

  const onFocus = useCallback(
    () => onListElementFocus?.(selfRef, { index, item }),
    [onListElementFocus, index, item]
  );

  const onBlur = useCallback(
    () => onListElementBlur?.(selfRef, { index, item }),
    [onListElementBlur, index, item]
  );

  const onPress = useCallback(
    () => onListElementPress?.(selfRef, { index, item }),
    [onListElementPress, index, item]
  );

  return (
    <Focusable
      ref={onRef}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      children={children}
      hasTVPreferredFocus={index === 0}
      {...rest}
    />
  );
};
