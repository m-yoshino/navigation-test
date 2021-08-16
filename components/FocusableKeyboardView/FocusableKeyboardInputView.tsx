import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { Animated, Text, View } from "react-native";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { Focusable } from "../Focusable";
import { fetchTransliterate } from "./service";
import type { TransliterateResult } from "./types";

const TransliterateItem: React.FC<{
  index: number;
  body: string;
  onSelect: (index: number) => void;
  children?: never;
}> = ({ index, body, onSelect }) => {
  const onPress = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <Focusable key={body} onPress={onPress}>
      {(focused) => (
        <View
          style={{
            padding: 4,
            backgroundColor: focused ? "dimgray" : "black",
            borderRadius: 2,
            marginLeft: index === 0 ? 0 : 2,
          }}
        >
          <Text key={body} style={{ color: "white", fontSize: 10 }}>
            {body}
          </Text>
        </View>
      )}
    </Focusable>
  );
};

const DEFAULT_TRANSLITERATE_RESULT: TransliterateResult = [["", []]];

type Props = {
  value: string;
  transliterateValue: string;
  onSelectTransliterate: (transliterate: string) => void;
  children?: never;
};

export const FocusableKeyboardInputFieldView: React.FC<Props> = ({
  transliterateValue,
  value,
  onSelectTransliterate,
}) => {
  const [transliterateResult, setTransliterateResult] =
    useState<TransliterateResult>(DEFAULT_TRANSLITERATE_RESULT);

  useEffect(() => {
    let canceled = false;
    const fetchTransliterateResult = async () => {
      const result = await fetchTransliterate(transliterateValue);
      if (!!result && !canceled) {
        setTransliterateResult(result);
      }
    };
    if (transliterateValue.trim() !== "") {
      fetchTransliterateResult();
    } else {
      setTransliterateResult(DEFAULT_TRANSLITERATE_RESULT);
    }
    return () => {
      canceled = true;
    };
  }, [transliterateValue]);

  const transliterationList = useMemo(
    () => transliterateResult?.[0][1] ?? [],
    [transliterateResult]
  );

  const selectTransliterate = useCallback(
    (index: number) => {
      onSelectTransliterate(transliterationList[index]);
    },
    [transliterationList]
  );

  const animatedValue = useAnimatedValue(1);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();
  }, [animatedValue]);

  return (
    <View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "black",
          minWidth: 200,
          flexDirection: "row",
          alignItems: "flex-end",
          paddingBottom: 2,
        }}
      >
        <View>
          <Text style={{ fontSize: 20 }}>{value}</Text>
        </View>
        {transliterateValue.trim() !== "" && (
          <View
            style={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: "gray",
              marginLeft: value.trim() !== "" ? 2 : 0,
            }}
          >
            <Text style={{ fontSize: 20 }}>{transliterateValue}</Text>
          </View>
        )}
        <Animated.View
          style={{
            opacity: animatedValue,
            marginLeft: 2,
            marginBottom: 2,
            width: 1,
            height: 24,
            backgroundColor: "black",
          }}
        />
      </View>
      <View style={{ paddingTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          {transliterationList.map((body, index) => (
            <TransliterateItem
              key={index}
              index={index}
              body={body}
              onSelect={selectTransliterate}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
