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

/*
Użyłbym tutaj raczej:
const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// expected output: 3

Zamiast switcha:

const currencies = ['PLN', 'USD', 'EUR'];

const isCurrency = (currency) => currencies.findIndex(currency) > -1;
 */
