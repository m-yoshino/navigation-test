import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View, Text, Button } from "react-native";
import { push } from "../navigation/service";

export const PrimaryScreen = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    push("Secondary");
  }, [navigation]);
  return (
    <View>
      <Text>Primary screen</Text>
      <Button title="navigate to secondary screen" onPress={onPress} />
    </View>
  );
};
