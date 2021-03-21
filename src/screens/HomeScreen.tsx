import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { currencies } from '../utils/mockData';
import { Button, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  Currency,
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
} from '../utils/types';
import { isCurrency } from '../utils/utils';
import { DatePicker } from '../components/DatePicker';
import { CurrencyPicker } from '../components/CurrencyPicker';
import { CurrencyList } from '../components/CurrencyList';

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export const HomeScreen: FC<Props> = ({ navigation }) => {
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [activeCurrency, setActiveCurrency] = useState<Currency>('EUR');
  const [rates, setRates] = useState(
    Object.fromEntries(
      Object.keys(currencies)
        .filter(currency => currency !== activeCurrency)
        .map(currency => [currency, 0]),
    ),
  );

  const onDateChange = (e: Event, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    if (Platform.OS === 'ios') {
      setDate(currentDate);
    } else if (Platform.OS === 'android' && e.type === 'set') {
      navigation.push('PastDate', {
        date: currentDate.toISOString(),
        currency: activeCurrency,
      });
    }
  };

  const onButtonPress = () => {
    navigation.navigate('PastDate', {
      date: date.toISOString(),
      currency: activeCurrency,
    });
    setDate(new Date());
    setShowDatePicker(!showDatePicker);
  };

  const onMainPress = () => setShowDatePicker(!showDatePicker);

  const onCurrencyPress = (currency: Currency) => setActiveCurrency(currency);

  const getRates = async () => {
    setIsLoading(true);
    const dateStr = moment(date).format('YYYY-MM-DD');
    const res = await fetch(
      `https://api.exchangeratesapi.io/${dateStr}?base=${activeCurrency}`,
    );
    const json = await res.json();
    const rates = await json.rates;
    setRates(rates);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchSettings = async () => {
        try {
          const interval = await AsyncStorage.getItem('interval');
          if (isActive && interval !== null) {
            setRefreshInterval(+interval);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchSettings();
      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!showDatePicker) {
      const interval = setInterval(() => {
        getRates();
      }, refreshInterval || 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [showDatePicker, refreshInterval, activeCurrency]);

  useEffect(() => {
    getRates();
  }, [activeCurrency]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Current currency:</Text>
        <CurrencyPicker
          activeCurrency={activeCurrency}
          onCurrencyPress={onCurrencyPress}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Current date:</Text>
        <DatePicker
          visible={showDatePicker}
          date={date}
          onChange={onDateChange}
          onMainPress={onMainPress}
          onPress={onButtonPress}
        />
      </View>
      <View style={styles.card}>
        <CurrencyList
          isLoading={isLoading}
          activeCurrency={activeCurrency}
          rates={rates}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionLabel: {
    fontFamily: 'Medium',
    fontSize: 16,
  },
});
