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
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { useFindUsernameMutation } from '../../../../lib/graphql';

interface SignUpUsernameProps {}

export const SignUpUsername: React.FC<SignUpUsernameProps> = () => {
  const [findusername] = useFindUsernameMutation();
  const { signUpInput, setSignUpInput, step, setStep } = useContext(SignUpContext);
  const maxLength = 16;
  const usernameSchema = object({
    username: string()
      .required('Cannot have an empty username.')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Username can only be composed of letters, numbers, and underscores.'
      )
      .max(maxLength, `Please enter a maximum of ${maxLength} characters.`)
      .test('', 'Username is already in use.', async (username) => {
        const { data } = await findusername({ variables: { input: username || '' } });
        return !data?.findusername;
      }),
  });

  const handleOnNext = (values: Partial<SignUpInput>) => {
    setSignUpInput((previousValues) => ({ ...previousValues, username: values.username }));
    setStep(step + Number(step + 1 < 4));
  };

  return (
    <View style={styles.container}>
      {/* Sample SVG to be replaced with the actual torch once we have it*/}
      <SampleSvg width={56} height={82} fill={'black'}></SampleSvg>
      <Text style={styles.header}>Username Time</Text>
      <Text style={styles.secondaryText}>
        This will be the name you display publicly. Make it uniquely yours!
      </Text>
      <Formik
        initialValues={{ username: '' }}
        onSubmit={handleOnNext}
        validationSchema={usernameSchema}>
        {({ handleSubmit, handleChange, values, errors, touched }) => {
          return (
            <>
              <Input
                placeholder="username"
                value={values.username}
                onChangeText={handleChange('username')}
                autoCorrect={false}
                autoCapitalize="none"
                error={touched.username && !!errors.username}
                style={styles.usernameField}
                Icon={UserCircleIcon}
                iconProps={{
                  size: 20,
                  fill: touched.username && !!errors.username ? 'red' : theme.gray[400],
                }}
              />
              <Text style={styles.errorMessageStyle}>{touched.username && errors.username}</Text>
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
  usernameField: {
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
