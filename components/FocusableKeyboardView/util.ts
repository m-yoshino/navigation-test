
const DAKUTEN_LABEL_MAP: {[key: string]: string} = {
  "か": "が",
  "き": "ぎ",
  "く": "ぐ",
  "け": "げ",
  "こ": "ご",
  "さ": "ざ",
  "し": "じ",
  "す": "ず",
  "せ": "ぜ",
  "そ": "ぞ",
  "た": "だ",
  "ち": "ぢ",
  "つ": "づ",
  "て": "で",
  "と": "ど",
  "は": "ば",
  "ひ": "び",
  "ふ": "ぶ",
  "へ": "べ",
  "ほ": "ぼ",
  "ぱ": "ば",
  "ぴ": "び",
  "ぷ": "ぶ",
  "ぺ": "べ",
  "ぽ": "ぼ",
  "っ": "づ",
};

const HANDAKUTEN_LABEL_MAP: {[key: string]: string} = {
  "は": "ぱ",
  "ひ": "ぴ",
  "ふ": "ぷ",
  "へ": "ぺ",
  "ほ": "ぽ",
  "ば": "ぱ",
  "び": "ぴ",
  "ぶ": "ぷ",
  "べ": "ぺ",
  "ぼ": "ぽ",
};

const KOMOJI_LABEL_MAP: {[key: string]: string} = {
  "あ": "ぁ",
  "い": "ぃ",
  "う": "ぅ",
  "え": "ぇ",
  "お": "ぉ",
  "や": "ゃ",
  "ゆ": "ゅ",
  "よ": "ょ",
  "つ": "っ",
  "づ": "っ",
};

const isDakuten = (label: string): boolean => {
  return Object.values(DAKUTEN_LABEL_MAP).includes(label);
};

export const convertDakuten = (label :string): string => {
  if (isDakuten(label)) {
    return Object.entries(DAKUTEN_LABEL_MAP).find(([_, value]) => value === label)?.[0] ?? label;
  }
  return DAKUTEN_LABEL_MAP?.[label] ?? label;
};

const isHandakuten = (label: string): boolean => {
  return Object.values(HANDAKUTEN_LABEL_MAP).includes(label);
};

export const convertHandakuten = (label :string): string => {
  if (isHandakuten(label)) {
    return Object.entries(HANDAKUTEN_LABEL_MAP).find(([_, value]) => value === label)?.[0] ?? label;
  }
  return HANDAKUTEN_LABEL_MAP?.[label] ?? label;
};

const isKomoji = (label: string): boolean => {
  return Object.values(KOMOJI_LABEL_MAP).includes(label);
};

export const convertKomoji = (label: string): string => {
  if (isKomoji(label)) {
    return Object.entries(KOMOJI_LABEL_MAP).find(([_, value]) => value === label)?.[0] ?? label;
  }
  return KOMOJI_LABEL_MAP?.[label] ?? label;
};

export const convertTailChar = (value: string, converter: (s: string) => string): string => {
  return `${value.slice(0, -1)}${converter(value.slice(-1))}`;
};