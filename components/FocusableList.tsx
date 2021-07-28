import React, { useCallback, useEffect } from "react";
import { useRef } from "react";
import { ListRenderItemInfo, TouchableOpacity } from "react-native";
import { FlatList, FlatListProps } from "react-native";
import { Focusable, FocusableProps, forceFocus } from "./Focusable";

export interface FocusableListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  listRef?: React.RefObject<FlatList>;

  onListElementFocus?: (
    element: React.RefObject<TouchableOpacity>,
    info: { item: ItemT; index: number }
  ) => void;
  onListElementBlur?: (
    element: React.RefObject<TouchableOpacity>,
    info: { item: ItemT; index: number }
  ) => void;
  onListElementPress?: (
    element: React.RefObject<TouchableOpacity>,
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
  onListElementFocus: _onListElementFocus,
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
        itemRef={itemRef}
        onItemRef={onItemRef}
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
  itemRef,
  onItemRef,
  onListElementFocus,
  onListElementBlur,
  onListElementPress,
  children,
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
      {...rest}
    />
  );
};
