import React from 'react';
import { FormInput } from './FormLayout';
import { dateInput } from '../services/dateInput.mjs';

export default function DateInput({ value, onChangeText, placeholder = 'DD/MM/AAAA', ...props }) {
  return (
    <FormInput
      {...props}
      placeholder={placeholder}
      accessibilityLabel={props.accessibilityLabel || placeholder}
      keyboardType="number-pad"
      inputMode="numeric"
      maxLength={10}
      autoCorrect={false}
      value={dateInput(value)}
      onChangeText={(text) => onChangeText(dateInput(text))}
    />
  );
}
