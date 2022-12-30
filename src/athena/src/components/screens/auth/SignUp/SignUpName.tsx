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
import { UserIcon } from 'react-native-heroicons/solid';

interface SignUpNameProps {}

export const SignUpName: React.FC<SignUpNameProps> = () => {
  const { signUpInput, setSignUpInput, step, setStep } = useContext(SignUpContext);
  const maxLength = 16;
  const nameSchema = object({
    // We may opt to make this optional in the future.
    name: string()
      .required('Cannot have an empty name.')
      .matches(/^[a-zA-Z]+$/, 'Name must only be composed of letters.')
      .max(maxLength, `Please enter a maximum of ${maxLength} characters.`),
  });

  const handleOnNext = (values: Partial<SignUpInput>) => {
    setSignUpInput((previousValues) => ({ ...previousValues, name: values.name }));
    setStep(step + Number(step < 4));
  };

  return (
    <View style={styles.container}>
      {/* Sample SVG to be replaced with the actual torch once we have it*/}
      <SampleSvg width={56} height={82} fill={'black'}></SampleSvg>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.secondaryText}>
        Why don't you start by telling us your name? This won't be displayed publicly.
      </Text>
      <Formik initialValues={{ name: '' }} onSubmit={handleOnNext} validationSchema={nameSchema}>
        {({ handleSubmit, handleChange, values, errors, touched }) => {
          return (
            <>
              <Input
                placeholder="name"
                value={values.name}
                onChangeText={handleChange('name')}
                autoCorrect={false}
                autoCapitalize="words"
                error={touched.name && !!errors.name}
                style={styles.nameField}
                Icon={UserIcon}
                iconProps={{
                  size: 20,
                  fill: touched.name && !!errors.name ? 'red' : theme.gray[400],
                }}
              />
              <Text style={styles.errorMessageStyle}>{touched.name && errors.name}</Text>
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
  nameField: {
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
