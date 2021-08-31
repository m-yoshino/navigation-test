import { useCallback } from "react";

type Ref<C> = React.MutableRefObject<C | null> | ((instance: C | null) => void);

const callback = <C>(instance: C | null, ref: Ref<C>) => {
  if (typeof ref === "function") {
    ref(instance);
  } else {
    // eslint-disable-next-line no-param-reassign
    ref.current = instance;
  }
};

export const useOnRef = <C>(...ref: Array<Ref<C> | null>): Ref<C> => {
  return useCallback(
    (instance: C | null) => {
      ref.forEach(_r => _r && callback(instance, _r));
    },
    [ref],
  );
};
