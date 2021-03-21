import React, { FC } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import { currencies } from '../utils/mockData';
import { Currency } from '../utils/types';

interface Props {
  activeCurrency: Currency;
  rates: any;
  isLoading?: boolean;
}

export const CurrencyList: FC<Props> = ({
  activeCurrency,
  rates,
  isLoading = false,
}) => {
  const currencyNames = Object.keys(currencies) as Currency[];
  return (
    <View>
      <Text style={styles.title}>
        {currencies[activeCurrency]} 1 {activeCurrency}
      </Text>
      <Divider style={{ margin: 10 }} />
      <ScrollView>
        {currencyNames
          .filter(currency => currency !== activeCurrency)
          .map(currency => (
            <View key={currency}>
              {isLoading ? (
                <View style={styles.textContainer}>
                  <View style={styles.loading} />
                </View>
              ) : (
                <View style={styles.textContainer}>
                  <Text style={styles.flag}>{currencies[currency]}</Text>
                  <Text style={styles.caption}>
                    {Number(rates[currency]).toFixed(2)} {currency}
                  </Text>
                </View>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  textContainer: {
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  loading: {
    backgroundColor: 'ghostwhite',
    width: '40%',
    height: 16,
    margin: 2,
    borderRadius: 15,
  },
  flag: {
    paddingRight: 5,
    fontSize: 18,
  },
  caption: {
    fontFamily: 'Regular',
    fontSize: 14,
  },
});
