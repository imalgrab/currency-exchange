import React, { FC, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, DefaultTheme, TextInput } from 'react-native-paper';

interface Props {}

export const SettingsScreen: FC<Props> = ({ navigation }: any) => {
  const [refreshInterval, setRefreshInterval] = useState<string>();
  const [error, setError] = useState<string>('');

  const handleSave = async () => {
    try {
      if (refreshInterval) {
        await AsyncStorage.setItem('interval', refreshInterval);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={refreshInterval}
        onChangeText={text => {
          console.log(text);
          setRefreshInterval(text);
          if (Number.isNaN(Number(text))) {
            setError('Please put an actual number');
          } else {
            setError('');
          }
        }}
        theme={theme}
        keyboardType="number-pad"
        label="Refresh interval (s)"
        style={styles.input}
      />
      <Text style={{ color: 'red' }}>{error}</Text>
      <View style={styles.buttons}>
        <Button
          disabled={error !== ''}
          theme={theme}
          onPress={handleSave}
          labelStyle={styles.buttonLabel}>
          SAVE
        </Button>
        <Button
          theme={theme}
          onPress={() => navigation.goBack()}
          labelStyle={styles.buttonLabel}>
          BACK
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  buttons: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'tomato',
  },
  input: {},
});

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: 'tomato' },
};
