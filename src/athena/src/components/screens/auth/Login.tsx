import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Form, Formik, FormikHelpers, useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthParamList } from '../../navigation';
import { LoginInput, useLoginMutation, User } from '../../../lib/graphql';
import { AUTH_TOKEN } from '../../../lib/constants';
import { Input } from '../../elements/Input';
import { Button } from '../../elements/Button';
import { UserContext } from '../../providers';

type ParamList = NativeStackScreenProps<AuthParamList, 'Login'>;
interface LoginProps extends ParamList {}

const initialValues: LoginInput = {
  username: '',
  password: '',
};

export const Login: React.FC<LoginProps> = ({ navigation }) => {
  // context
  const { refetch } = useContext(UserContext);

  // graphql
  const [login, { data }] = useLoginMutation();

  const onSubmit = async (values: LoginInput) => {
    const { data, errors } = await login({ variables: { input: values } });

    // TODO: handle errors
    if (!data?.login) return;

    await AsyncStorage.setItem(AUTH_TOKEN, data.login);
    await refetch();
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <KeyboardAvoidingView style={styles.keyboardView} behavior={'padding'}>
            <Text style={{ ...styles.heading2, marginBottom: 20 }}>Login</Text>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ handleChange, handleSubmit, values }) => (
                <>
                  <Input
                    placeholder="username"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={{ marginBottom: 14 }}
                  />
                  <Input
                    value={values.password}
                    onChangeText={handleChange('password')}
                    placeholder="password"
                    textContentType="password"
                    autoCorrect={false}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    style={{ marginBottom: 54 }}
                  />

                  <Button onPress={handleSubmit as () => void}>Login</Button>
                </>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
  keyboardView: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 99,
  },
});
