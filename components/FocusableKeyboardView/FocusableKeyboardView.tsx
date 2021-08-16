import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Focusable } from "../Focusable";
import {
  KEY_LABEL_SIZE,
  KEY_MARGIN_SIZE,
  SPECIAL_KEY_LABEL,
} from "./constants";
import { FocusableKeyboardInputFieldView } from "./FocusableKeyboardInputView";
import { KeyLabel, KeyLabelView } from "./KeyLabel";
import {
  convertDakuten,
  convertHandakuten,
  convertKomoji,
  convertTailChar,
} from "./util";

const INPUT_KEY_LABEL_LIST: string[][] = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "ゆ", "よ", SPECIAL_KEY_LABEL.DAKUTEN, SPECIAL_KEY_LABEL.HANDAKUTEN],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "を", "ん", "ー", SPECIAL_KEY_LABEL.KOMOJI],
];

export const FocusableKeyboardView: React.FC<{
  children?: never;
}> = () => {
  const [value, setValue] = useState("");
  const [transliterateValue, setTransliterateValue] = useState(value);
  const onChangeText = useCallback((callback: (str: string) => string) => {
    setTransliterateValue(callback);
  }, []);
  const onSelectTransliterate = useCallback((transliterate: string) => {
    // TODO: useReducerに移行する
    setValue((s) => `${s}${transliterate}`);
    setTransliterateValue("");
  }, []);

  const onKeyPress = useCallback(
    (label: string) => {
      switch (label) {
        case SPECIAL_KEY_LABEL.KOMOJI: {
          setTransliterateValue((value) =>
            convertTailChar(value, convertKomoji)
          );
          break;
        }
        case SPECIAL_KEY_LABEL.DAKUTEN: {
          setTransliterateValue((value) =>
            convertTailChar(value, convertDakuten)
          );
          break;
        }
        case SPECIAL_KEY_LABEL.HANDAKUTEN: {
          setTransliterateValue((value) =>
            convertTailChar(value, convertHandakuten)
          );
          break;
        }
        default: {
          setTransliterateValue((value) => value + label);
        }
      }
    },
    [onChangeText]
  );

  const onPressSpace = useCallback(() => {
    if (transliterateValue.trim() !== "") {
      setTransliterateValue((value) => value + " ");
    } else {
      setValue((value) => value + " ");
    }
  }, [onChangeText]);

  const onPressDelete = useCallback(() => {
    if (transliterateValue.trim() !== "") {
      setTransliterateValue((value) => convertTailChar(value, (_) => ""));
    } else {
      setValue((value) => convertTailChar(value, (_) => ""));
    }
  }, [transliterateValue]);

  return (
    <View style={{ flexDirection: "row" }}>
      <View>
        {INPUT_KEY_LABEL_LIST.map((row, index) => (
          <View key={index} style={{ flexDirection: "row" }}>
            {row.map((label) => (
              <View key={label} style={{ padding: KEY_MARGIN_SIZE / 2 }}>
                <KeyLabel label={label} onKeyPress={onKeyPress} />
              </View>
            ))}
          </View>
        ))}
        <View style={{ flexDirection: "row" }}>
          <Focusable
            style={{
              padding: KEY_MARGIN_SIZE / 2,
            }}
          >
            {(focused) => (
              <KeyLabelView
                focused={focused}
                style={{
                  width: KEY_LABEL_SIZE * 2 + KEY_MARGIN_SIZE,
                  height: KEY_LABEL_SIZE,
                }}
              >
                {"abc123"}
              </KeyLabelView>
            )}
          </Focusable>

          <Focusable
            onPress={onPressSpace}
            style={{
              padding: KEY_MARGIN_SIZE / 2,
            }}
          >
            {(focused) => (
              <KeyLabelView
                focused={focused}
                style={{
                  width: KEY_LABEL_SIZE,
                  height: KEY_LABEL_SIZE,
                }}
              >
                {"_"}
              </KeyLabelView>
            )}
          </Focusable>

          <Focusable
            onPress={onPressDelete}
            style={{
              padding: KEY_MARGIN_SIZE / 2,
            }}
          >
            {(focused) => (
              <KeyLabelView
                focused={focused}
                style={{
                  width: KEY_LABEL_SIZE * 2 + KEY_MARGIN_SIZE,
                  height: KEY_LABEL_SIZE,
                }}
              >
                {"delete"}
              </KeyLabelView>
            )}
          </Focusable>
        </View>
      </View>
      <View style={{ paddingLeft: 20 }}>
        <FocusableKeyboardInputFieldView
          value={value}
          transliterateValue={transliterateValue}
          onSelectTransliterate={onSelectTransliterate}
        />
      </View>
    </View>
  );
};
