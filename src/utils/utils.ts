import { currencies } from './mockData';
import { Currency } from './types';

export const isCurrency = (item: string): item is Currency =>
  Object.keys(currencies).findIndex(currency => item === currency) > -1;
