import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface Props {}

export const DateScreen: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>Date Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
