import { StyleSheet, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { SignUpContext } from './SignUp';
import { Input } from '../../../elements/Input';
import theme from '../../../../theme';
import { Formik } from 'formik';
import { Button } from '../../../elements/Button';
import SampleSvg from '../../../../../assets/caution.svg';
import { PageControl } from 'react-native-ui-lib';
import { object, ref, string, ValidationError } from 'yup';
import { SignUpInput } from '../../../../lib/graphql';
import { KeyIcon, ClipboardDocumentCheckIcon, LockClosedIcon } from 'react-native-heroicons/solid';

interface SignUpPasswordProps {}

interface SignUpInputConfirmPass extends SignUpInput {
  confirm_password: string;
}

export const SignUpPassword: React.FC<SignUpPasswordProps> = () => {
  const { signUpInput, setSignUpInput, step, setStep } = useContext(SignUpContext);
  const maxLength = 16;
  const minLength = 4;
  const passwordSchema = object({
    password: string()
      .required('Password cannot be empty.')
      .min(minLength, `Password must be at least ${minLength} characters.`)
      .max(maxLength, `Password must be at most ${maxLength} characters.`),

    confirm_password: string()
      .oneOf([ref('password'), null], 'Passwords must match.')
      .required('Please confirm your password.'),
  });

  const handleOnNext = (values: Partial<SignUpInputConfirmPass>) => {
    setSignUpInput((previousValues) => ({ ...previousValues, password: values.password }));
    console.log(signUpInput);
  };

  return (
    <View style={styles.container}>
      {/* Sample SVG to be replaced with the actual torch once we have it*/}
      <SampleSvg width={56} height={82} fill={'black'}></SampleSvg>
      <Text style={styles.header}>Password...Shhh</Text>
      <Text style={styles.secondaryText}>
        Enter a strong password. Don't worry, you can recover it if you forget.
      </Text>
      <Formik
        initialValues={{ password: '', confirm_password: '' }}
        onSubmit={handleOnNext}
        validationSchema={passwordSchema}>
        {({ handleSubmit, handleChange, values, errors, touched }) => {
          return (
            <>
              <Input
                placeholder="password"
                value={values.password}
                textContentType="password"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                autoCorrect={false}
                autoCapitalize="none"
                error={touched.password && !!errors.password}
                style={styles.passwordField}
                Icon={LockClosedIcon}
                iconProps={{
                  size: 20,
                  fill: touched.password && !!errors.password ? 'red' : theme.gray[400],
                }}
              />
              <Input
                placeholder="confirm password"
                value={values.confirm_password}
                textContentType="password"
                secureTextEntry={true}
                onChangeText={handleChange('confirm_password')}
                autoCorrect={false}
                autoCapitalize="none"
                error={touched.confirm_password && !!errors.confirm_password}
                style={styles.passwordField}
                Icon={ClipboardDocumentCheckIcon}
                iconProps={{
                  size: 20,
                  fill:
                    touched.confirm_password && !!errors.confirm_password ? 'red' : theme.gray[400],
                }}
              />
              {/* Password error message takes priority */}
              <Text style={styles.errorMessageStyle}>
                {touched.confirm_password && (errors.password || errors.confirm_password)}
              </Text>
              <View style={styles.footer}>
                <PageControl
                  color={theme.blue[500]}
                  inactiveColor={theme.gray[200]}
                  currentPage={step}
                  numOfPages={4}
                  limitShownPages
                  spacing={8}
                  size={8}
                />
                <Button style={{ padding: 19 }} onPress={handleSubmit as () => void}>
                  Create Account
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontWeight: '700',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 35,
  },
  secondaryText: {
    fontWeight: '500',
    fontSize: 16,
    color: theme.gray[400],
    textAlign: 'center',
    marginBottom: 35,
  },
  passwordField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  errorMessageStyle: {
    fontSize: 14,
    color: 'red',
    // Fix the lineHeight to prevent bumping when the text comes in
    lineHeight: 14,
    marginBottom: 175,
  },
});
