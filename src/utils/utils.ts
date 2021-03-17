import { Currency } from './types';

export const isCurrency = (currency: string): currency is Currency => {
  switch (currency) {
    case 'PLN':
    case 'EUR':
    case 'USD':
    case 'CHF':
    case 'GBP':
    case 'CAD':
    case 'NOK':
    case 'JPY':
    case 'AUD':
    case 'SEK':
    case 'CZK':
    case 'HUF':
      return true;
    default:
      return false;
  }
};
