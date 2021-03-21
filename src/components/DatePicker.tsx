import React, { FC } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { theme } from '../utils/theme';
import moment from 'moment';

interface Props {
  visible: boolean;
  date: Date;
  onMainPress: () => void;
  onChange: (e: any, selectedDate: Date | undefined) => void;
  onPress: () => void;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: FC<Props> = ({
  visible,
  date,
  onMainPress,
  onChange,
  onPress,
  minDate,
  maxDate,
}) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.dateButton}
        labelStyle={styles.dateButtonLabel}
        onPress={onMainPress}>
        {moment(date).format('DD.MM.YYYY')}
      </Button>
      {visible ? (
        <>
          <DateTimePicker
            value={date}
            minimumDate={minDate}
            maximumDate={maxDate}
            mode="date"
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
          {Platform.OS === 'ios' && (
            <Button onPress={onPress} theme={theme}>
              Apply
            </Button>
          )}
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});
