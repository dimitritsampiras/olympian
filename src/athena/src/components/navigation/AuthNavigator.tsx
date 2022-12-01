import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { UserContext } from '../providers';
import { LandingPage } from '../screens/auth/LandingPage';
import { Login } from '../screens/auth/Login';
import theme from '../../theme';
import { RootStackNavigator } from './RootNavigator';
import { isNil } from 'lodash';

export type AuthParamList = {
  LandingPage: undefined;
  Register: undefined;
  Login: undefined;
  Root: undefined;
};

// authentication screen stack
const AuthStack = createNativeStackNavigator<AuthParamList>();

/**
 * Authentation Navigator FC

 * This renders all auth screens: 
 * landing page, login page, register page, and main tab navigator 
 * depending on if user exists from UserContext
 */
export const AuthNavigator: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <AuthStack.Navigator>
      {isNil(user) ? (
        <>
          <AuthStack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{
              contentStyle: {
                backgroundColor: theme.gray[50],
              },
            }}
          />
          <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ contentStyle: { backgroundColor: theme.gray[50] } }}
          />
        </>
      ) : (
        <AuthStack.Screen
          name="Root"
          component={RootStackNavigator}
          options={{ headerShown: false }}
        />
      )}
    </AuthStack.Navigator>
  );
};
