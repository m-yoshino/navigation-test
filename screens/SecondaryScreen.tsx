import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View, Text, Button } from "react-native";
import { push } from "../navigation/service";

export const SecondaryScreen = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    push("Tertiary");
  }, [navigation]);
  return (
    <View>
      <Text>Secondary screen</Text>
      <Button title="navigate to tertiary screen" onPress={onPress} />
    </View>
  );
};
