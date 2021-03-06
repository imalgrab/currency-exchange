import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { PastDateScreen } from '../screens/PastDateScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons/';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList, TabParamList } from '../utils/types';
import moment from 'moment';

const Stack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();



export const HomeStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerTitle: 'Currency Exchange',
        headerTitleAlign: 'center', // mozna to wynieść do Stack.Navigator, bo są takie same dla każdego widoku
        headerTitleStyle: { fontFamily: 'Bold' }, // mozna to wynieść do Stack.Navigator, bo są takie same dla każdego widoku
      }}
    />
    <Stack.Screen
      name="PastDate"
      options={({ route }) => ({
        headerTitle: moment(route.params.date).format('DD.MM.YYYY'), // moment jest tutaj overkillem :), da się to w czystm JS zrobic new Date(date).to...
        headerTitleAlign: 'center', // mozna to wynieść do Stack.Navigator, bo są takie same dla każdego widoku
        headerTitleStyle: { fontFamily: 'Bold' }, // mozna to wynieść do Stack.Navigator, bo są takie same dla każdego widoku
      })}
      component={PastDateScreen}
    />
  </Stack.Navigator>
);

/*
  nie lubie miec tak rozbudowanych parametrow w htmlu, jak moge to dla czytelnosci wyciagam to wyzej przed render
*/

export const Navigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home-outline';
              } else {
                iconName = focused ? 'ios-settings' : 'ios-settings-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />; // ts error, name musi być stringiem, więc można dodać default value do iconName (let iconName = 'x')
            },
          })}
          tabBarOptions={{
            activeTintColor: '#3498db',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{ title: 'Home' }}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
