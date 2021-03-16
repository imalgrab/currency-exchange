import React, { FC, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { currencies } from '../utils/mockData';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreenNavigationProp, HomeScreenRouteProp } from '../utils/types';

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export const HomeScreen: FC<Props> = ({ navigation, route }) => {
  const pastDate = route.params?.date;

  const [refreshInterval, setRefreshInterval] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(pastDate || new Date());
  const [currency, setCurrency] = useState('PLN');
  const [rates, setRates] = useState(
    Object.fromEntries(currencies.filter(c => c !== currency).map(c => [c, 0])),
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const refreshInterval = await AsyncStorage.getItem('interval');
        if (refreshInterval !== null) {
          setRefreshInterval(Number(refreshInterval));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, [navigation]);

  useEffect(() => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const getRates = async () => {
      setIsLoading(true);
      const res = await fetch(
        `https://api.exchangeratesapi.io/${dateStr}?base=${currency}`,
      );
      const json = await res.json();
      const rates = await json.rates;
      setRates(rates);
      setIsLoading(false);
    };
    getRates();
  }, [currency, date]);

  const onDatePickerChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    navigation.push('Home', {
      date: currentDate,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text>Current currency:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyPicker}>
          {currencies.map(curr => (
            <View key={curr} style={styles.currencyItemWrapper}>
              <TouchableOpacity onPress={() => setCurrency(curr)}>
                <Text
                  style={
                    currency === curr
                      ? styles.currencyItemSelected
                      : styles.currencyItem
                  }>
                  {curr}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text>Current date:</Text>
        <Button
          mode="contained"
          color="tomato"
          style={styles.dateButton}
          labelStyle={styles.dateButtonLabel}
          onPress={() => setShowDatePicker(!showDatePicker)}>
          {moment(date).format('DD.MM.YYYY')}
        </Button>
        <View style={styles.datePicker}>
          {showDatePicker && (
            <DateTimePicker
              maximumDate={new Date()}
              minimumDate={new Date(1999, 0, 4)}
              value={date}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={onDatePickerChange}
            />
          )}
        </View>
      </View>
      <View style={styles.card}>
        <ScrollView>
          {currencies
            .filter(c => c !== currency)
            .map(curr => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Text>1 {currency}</Text>
                <Text>
                  {isLoading
                    ? '...'
                    : (Math.round(rates[curr] * 100) / 100).toFixed(2)}
                  {` ${curr}`}
                </Text>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
  },
  datePicker: {
    paddingVertical: 10,
  },
  dateButton: {
    marginTop: 20,
  },
  dateButtonLabel: {
    color: 'white',
  },
  currencyPicker: {
    paddingVertical: 10,
    justifyContent: 'center',
  },
  currencyItemWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  currencyItemSelected: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  currencyItem: {
    color: 'black',
  },
});
