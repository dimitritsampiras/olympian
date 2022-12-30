import { StyleSheet, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { SignUpContext } from './SignUp';
import { Input } from '../../../elements/Input';
import theme from '../../../../theme';
import { Formik } from 'formik';
import { Button } from '../../../elements/Button';
import SampleSvg from '../../../../../assets/caution.svg';
import { PageControl } from 'react-native-ui-lib';
import { object, string, ValidationError } from 'yup';
import { SignUpInput } from '../../../../lib/graphql';
import { AtSymbolIcon } from 'react-native-heroicons/solid';
import { useFindEmailMutation } from '../../../../lib/graphql';

interface SignUpEmailProps {}

export const SignUpEmail: React.FC<SignUpEmailProps> = () => {
  const { signUpInput, setSignUpInput, step, setStep } = useContext(SignUpContext);
  const [findemail] = useFindEmailMutation();
  const maxLength = 32;
  const emailSchema = object({
    email: string()
      .required('Cannot have an empty email address.')
      .email('Please enter a valid email address\n(e.g. johndoe@example.com)')
      .max(maxLength, `Please enter a maximum of ${maxLength} characters.`)
      .test('', 'Email is already used on another account.', async (email) => {
        const { data } = await findemail({ variables: { input: email || '' } });
        return !data?.findemail;
      }),
  });

  const handleOnNext = (values: Partial<SignUpInput>) => {
    setSignUpInput((previousValues) => ({ ...previousValues, email: values.email }));
    setStep(step + Number(step + 1 < 4));
  };

  return (
    <View style={styles.container}>
      {/* Sample SVG to be replaced with the actual torch once we have it*/}
      <SampleSvg width={56} height={82} fill={'black'}></SampleSvg>
      <Text style={styles.header}>Hello, {signUpInput.name}!</Text>
      <Text style={styles.secondaryText}>
        Please enter your email address, just in case you forget your password.
      </Text>
      <Formik initialValues={{ email: '' }} onSubmit={handleOnNext} validationSchema={emailSchema}>
        {({ handleSubmit, handleChange, values, errors, touched }) => {
          return (
            <>
              <Input
                placeholder="email"
                value={values.email}
                onChangeText={handleChange('email')}
                autoCorrect={false}
                autoCapitalize="none"
                error={touched.email && !!errors.email}
                style={styles.emailField}
                Icon={AtSymbolIcon}
                iconProps={{
                  size: 20,
                  fill: touched.email && !!errors.email ? 'red' : theme.gray[400],
                }}
              />
              <Text style={styles.errorMessageStyle}>{touched.email && errors.email}</Text>
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
                  Next
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
  emailField: {
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
    marginBottom: 240,
  },
});
