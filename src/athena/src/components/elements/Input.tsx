import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

interface InputProps extends TextInputProps {
  style?: TextStyle;
  placeholder?: string;
  label?: string;
  color?: string;
  state?: string;
}

export const Input: React.FC<InputProps> = ({ style, placeholder, ...props }) => {
  const animatedTranslationX = useRef(new Animated.Value(1)).current;

  const handleOnPressIn = () => {
    Haptics.selectionAsync();
    Animated.timing(animatedTranslationX, {
      toValue: 14,
      duration: 3,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start();
  };

  const handleUnFocus = () => {
    Haptics.selectionAsync();
    Animated.timing(animatedTranslationX, {
      toValue: 1,
      duration: 3,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        ...styles.container,
        ...style,
      }}>
      <TextInput
        {...props}
        style={{ ...styles.input }}
        selectionColor={theme.gray[900]}
        onPressIn={handleOnPressIn}
        onSubmitEditing={handleUnFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.gray[400]}
        // autoCapitalize={'none'}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingLeft: 10,
    borderRadius: 18,
    backgroundColor: theme.gray[100],
    width: '100%',
    zIndex: 1,
  },
  input: {
    padding: 13,
    height: '100%',
    borderRadius: 18,
    zIndex: 10,
    fontWeight: '300',
  },
});
