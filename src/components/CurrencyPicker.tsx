import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { currencies } from '../utils/mockData';
import { Currency } from '../utils/types';

interface Props {
  activeCurrency: Currency;
  onCurrencyPress: (currency: Currency) => void;
}

export const CurrencyPicker: FC<Props> = ({
  activeCurrency,
  onCurrencyPress,
}) => {
  const currencyNames = Object.keys(currencies) as Currency[];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {currencyNames.map(item => (
        <View key={item} style={styles.currencyWrapper}>
          <TouchableOpacity onPress={() => onCurrencyPress(item)}>
            <Text
              style={
                activeCurrency === item ? styles.selected : styles.currency
              }>
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
  },
  currencyWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selected: {
    fontFamily: 'Medium',
    fontSize: 16,
    color: '#3498db',
  },
  currency: {
    fontFamily: 'Regular',
    fontSize: 16,
    color: 'black',
  },
});
