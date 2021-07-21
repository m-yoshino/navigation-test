import { createContext } from "react";

export type FocusableContextValue = boolean;
export const FocusableContext = createContext<FocusableContextValue>(false);
