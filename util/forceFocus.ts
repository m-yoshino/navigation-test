import type { FocusableRefObject } from "../@types/tvos";

export const forceFocus = (ref: FocusableRefObject) => {
  ref.current?.setNativeProps({ hasTVPreferredFocus: true });
};