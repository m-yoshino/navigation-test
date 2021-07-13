import React, { useCallback } from "react";
import { View, Text, Button } from "react-native";
import { navigate } from "../navigation/service";

export const SecondaryScreen = () => {
  const onPress = useCallback(() => {
    navigate("Tertiary");
  }, []);
  return (
    <View>
      <Text>Secondary screen</Text>
      <Button title="navigate to tertiary screen" onPress={onPress} />
    </View>
  );
};
