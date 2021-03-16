import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  PastDateScreenNavigationProp,
  PastDateScreenRouteProp,
} from '../utils/types';

interface Props {
  navigation: PastDateScreenNavigationProp;
  route: PastDateScreenRouteProp;
}

export const PastDateScreen: FC<Props> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>Date Screen</Text>
      <Text>{route.params.date.toLocaleDateString()}</Text>
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
