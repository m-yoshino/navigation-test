import type { FocusableRef } from "../@types/tvos";

export const forceFocus = (ref: FocusableRef) => {
  ref.current?.setNativeProps({ hasTVPreferredFocus: true });
};