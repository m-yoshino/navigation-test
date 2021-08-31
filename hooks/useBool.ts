import { useCallback, useState } from "react";

export const useBool = (def: boolean) => {
  const [bool, _setBool] = useState(def);
  const setTrue = useCallback(() => _setBool(true), []);
  const setFalse = useCallback(() => _setBool(false), []);
  // const setBool = useCallback((b: boolean) => _setBool(b), []);
  // const toggle = useCallback(() => _setBool(b => !b), []);

  return {
    bool,
    setFalse,
    setTrue,
    // toggle,
    // setBool,
  };
};
