import { AuthParamList } from '../../../navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpInput } from '../../../../lib/graphql';
import React, { createContext, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../../../theme';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

import { SignUpName } from './SignUpName';
import { SignUpUsername } from './SignUpUsername';
import { Button } from '../../../elements/Button';
import { SignUpPassword } from './SignUpPassword';
import { SignUpEmail } from './SignUpEmail';

type ParamList = NativeStackScreenProps<AuthParamList, 'SignUp'>;

interface SignUpProps extends ParamList {}

export const SignUpContext = createContext({
  step: 0,
  setStep: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
  signUpInput: {} as Partial<SignUpInput>,
  setSignUpInput: (() => {}) as React.Dispatch<React.SetStateAction<Partial<SignUpInput>>>,
});

export const SignUp: React.FC<SignUpProps> = () => {
  const [signUpInput, setSignUpInput] = useState<Partial<SignUpInput>>({
    email: '',
    name: '',
    password: '',
    username: '',
  });
  const [step, setStep] = useState(0);

  return (
    <SignUpContext.Provider value={{ signUpInput, setSignUpInput, step, setStep }}>
      <SafeAreaView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.screen}>
            <KeyboardAvoidingView behavior="padding">
              {/* This header should be a component */}
              <View style={styles.header}>
                <Pressable onPress={() => setStep((prev) => prev - Number(prev > 0))}>
                  <ChevronLeftIcon size="20" {...{ fill: theme.gray[600] }} />
                </Pressable>
              </View>
              {step === 0 && <SignUpName />}
              {step === 1 && <SignUpEmail />}
              {step === 2 && <SignUpUsername />}
              {step === 3 && <SignUpPassword />}
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SignUpContext.Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.gray[50],
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
