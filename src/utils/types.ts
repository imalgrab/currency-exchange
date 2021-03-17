// NAVIGATION

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type HomeStackParamList = {
  Home: undefined;
  PastDate: { date: string; currency: Currency };
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Home'
>;
export type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'Home'>;

export type PastDateScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PastDate'
>;
export type PastDateScreenRouteProp = RouteProp<HomeStackParamList, 'PastDate'>;

export type SettingsScreenNavigationProp = StackNavigationProp<
  TabParamList,
  'Settings'
>;
export type SettingsScreenRouteProp = RouteProp<TabParamList, 'Settings'>;

// OTHER

export type Currency =
  | 'PLN'
  | 'EUR'
  | 'USD'
  | 'CHF'
  | 'GBP'
  | 'CAD'
  | 'NOK'
  | 'JPY'
  | 'AUD'
  | 'SEK'
  | 'CZK'
  | 'HUF';
