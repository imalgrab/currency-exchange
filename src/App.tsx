import React from 'react';
import {
  ActivityIndicator,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Navigator } from './navigation/Navigator';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [loaded] = useFonts({
    Bold: require('./assets/fonts/Ubuntu-Bold.ttf'),
    Medium: require('./assets/fonts/Ubuntu-Medium.ttf'),
    Regular: require('./assets/fonts/Ubuntu-Regular.ttf'),
    Light: require('./assets/fonts/Ubuntu-Light.ttf'),
  });

  if (!loaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <ActivityIndicator size="large" color="tomato" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <PaperProvider>
      <Navigator />
    </PaperProvider>
  );
}
