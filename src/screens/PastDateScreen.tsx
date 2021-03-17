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
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { currencies } from '../utils/mockData';
import { Button, Divider } from 'react-native-paper';
import {
  PastDateScreenNavigationProp,
  PastDateScreenRouteProp,
} from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '@react-navigation/stack';
import { theme } from '../utils/theme';

interface Props {
  navigation: PastDateScreenNavigationProp;
  route: PastDateScreenRouteProp;
}

export const PastDateScreen: FC<Props> = ({ navigation, route }) => {
  const pastDateString = route.params?.date;
  const prevCurrency = route.params.currency;

  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(
    (pastDateString && new Date(pastDateString)) || new Date(),
  );
  const [currency, setCurrency] = useState(prevCurrency || 'EUR');
  const [rates, setRates] = useState(
    Object.fromEntries(
      Object.keys(currencies)
        .filter(c => c !== currency)
        .map(c => [c, 0]),
    ),
  );

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

      console.log('Request');
      fetchSettings();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const getRates = async () => {
    setIsLoading(true);
    const dateStr = moment(date).format('YYYY-MM-DD');
    const res = await fetch(
      `https://api.exchangeratesapi.io/${dateStr}?base=${currency}`,
    );
    const json = await res.json();
    const rates = await json.rates;
    setRates(rates);
    setIsLoading(false);
  };

  useEffect(() => {
    //when datePicker is enabled don't refresh
    if (!showDatePicker) {
      const interval = setInterval(() => {
        getRates();
      }, refreshInterval || 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [showDatePicker]);

  useEffect(() => {
    getRates();
  }, [date, currency]);

  const onDatePickerChange = (e: Event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    if (Platform.OS === 'ios') {
      setDate(currentDate);
    } else if (Platform.OS === 'android' && e.type === 'set') {
      navigation.push('PastDate', {
        date: currentDate.toISOString(),
        currency,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Current currency:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyPicker}>
          {Object.keys(currencies).map(curr => (
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
        <Text style={styles.sectionLabel}>Current date:</Text>
        <Button
          mode="contained"
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
          {Platform.OS === 'ios' && showDatePicker && (
            <Button
              onPress={() => {
                navigation.push('PastDate', {
                  date: date.toISOString(),
                  currency,
                });
                setDate(new Date(pastDateString));
                setShowDatePicker(!showDatePicker);
              }}
              theme={theme}>
              Apply
            </Button>
          )}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>
          {currencies[currency]} 1 {currency}
        </Text>
        <Divider style={{ margin: 10 }} />
        <ScrollView>
          {Object.keys(currencies)
            .filter(c => c !== currency)
            .map((curr, i) => (
              <View key={`${i}`}>
                {isLoading ? (
                  <View style={styles.textContainer}>
                    <View style={styles.loading} />
                  </View>
                ) : (
                  <View style={styles.textContainer}>
                    <Text style={styles.flag}>{currencies[curr]}</Text>
                    <Text style={styles.caption}>
                      {Number(rates[curr]).toFixed(2)} {curr}
                    </Text>
                  </View>
                )}
              </View>
            ))}
        </ScrollView>
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
  datePicker: {
    paddingVertical: 10,
  },
  dateButton: {
    backgroundColor: '#3498db',
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  dateButtonLabel: {
    fontFamily: 'Regular',
    fontSize: 14,
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
    fontFamily: 'Medium',
    fontSize: 16,
    color: '#3498db',
  },
  currencyItem: {
    fontFamily: 'Regular',
    fontSize: 16,
    color: 'black',
  },
  sectionLabel: {
    fontFamily: 'Medium',
    fontSize: 16,
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
});
