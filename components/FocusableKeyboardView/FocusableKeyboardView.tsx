import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Focusable } from "../Focusable";
import {
  KEY_LABEL_SIZE,
  KEY_MARGIN_SIZE,
  SPECIAL_KEY_LABEL,
} from "./constants";
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
  value: string;
  onChangeText: (callback: (value: string) => string) => void;
  children?: never;
}> = ({ value, onChangeText }) => {
  const onKeyPress = useCallback(
    (label: string) => {
      if (label === SPECIAL_KEY_LABEL.KOMOJI) {
        onChangeText((value) => convertTailChar(value, convertKomoji));
        return;
      }
      if (label === SPECIAL_KEY_LABEL.DAKUTEN) {
        onChangeText((value) => convertTailChar(value, convertDakuten));
        return;
      }
      if (label === SPECIAL_KEY_LABEL.HANDAKUTEN) {
        onChangeText((value) => convertTailChar(value, convertHandakuten));
        return;
      }
      onChangeText((value) => value + label);
    },
    [onChangeText]
  );

  const onPressSpace = useCallback(() => {
    onChangeText((value) => value + " ");
  }, [onChangeText]);

  const onPressDelete = useCallback(() => {
    onChangeText((value) => convertTailChar(value, (_) => ""));
  }, [onChangeText]);

  return (
    <View>
      <Text>{value}</Text>
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
    </View>
  );
};
