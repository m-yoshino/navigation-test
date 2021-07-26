import React, { useCallback } from "react";
import {
  findNodeHandle,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import { FlatList, FlatListProps } from "react-native";
import { Focusable } from "./Focusable";

const getNextFocus = <ItemT extends unknown>(
  { horizontal }: Pick<FocusableListProps<ItemT>, "horizontal">,
  { index }: ListRenderItemInfo<ItemT>,
  refList: React.RefObject<React.RefObject<TouchableOpacity>[]>
) => {
  const forwardRef = refList.current?.[index + 1];
  const backwardRef = refList.current?.[index - 1];
  const forwardHandle = forwardRef
    ? findNodeHandle(forwardRef.current)
    : undefined;
  const backwardHandle = backwardRef
    ? findNodeHandle(backwardRef.current)
    : undefined;
  if (horizontal) {
    return {
      nextFocusRight: forwardHandle,
      nextFocusLeft: backwardHandle,
    };
  }
  return {
    nextFocusDown: forwardHandle,
    nextFocusLeft: backwardHandle,
  };
};

export interface FocusableListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem"> {
  ref?: React.RefObject<FlatList>;

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

  nextFocusUp?: React.RefObject<unknown>;
  nextFocusLeft?: React.RefObject<unknown>;
  nextFocusRight?: React.RefObject<unknown>;
  nextFocusDown?: React.RefObject<unknown>;

  focusableItemProps?: {};

  renderItem: (
    info: ListRenderItemInfo<ItemT> & { focused: boolean }
  ) => React.ReactNode;
}

export const FocusableList = <ItemT extends unknown>({
  ref,
  data,
  focusableItemProps,
  renderItem: _renderItem,
  onListElementFocus,
  onListElementBlur,
  onListElementPress,
  ...rest
}: FocusableListProps<ItemT>) => {
  const itemRef = React.useRef<React.RefObject<TouchableOpacity>[]>([]);

  const renderItem = useCallback<
    NonNullable<FlatListProps<ItemT>["renderItem"]>
  >(
    (props) => {
      const { index } = props;
      if (typeof itemRef.current[index] === "undefined") {
        itemRef.current[index] = React.createRef<TouchableOpacity>();
      }
      return (
        <Focusable
          ref={itemRef.current[index]}
          onFocus={(_) => onListElementFocus?.(itemRef.current[index], props)}
          onBlur={(_) => onListElementBlur?.(itemRef.current[index], props)}
          onPress={(_) => onListElementPress?.(itemRef.current[index], props)}
          {...focusableItemProps}
          {...getNextFocus(rest, props, itemRef)}
        >
          {(focused) => _renderItem?.({ ...props, focused })}
        </Focusable>
      );
    },
    [_renderItem, onListElementFocus, onListElementBlur, onListElementPress]
  );

  return <FlatList ref={ref} data={data} renderItem={renderItem} {...rest} />;
};
