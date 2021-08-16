import type { TransliterateResult } from "./types";

export const fetchTransliterate = async (source: string): Promise<TransliterateResult | undefined>=> {
  const result = await fetch(`http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(source + ",")}`);
  if (result.status !== 200) {
    return;
  }
  return await result.json() as TransliterateResult;
};