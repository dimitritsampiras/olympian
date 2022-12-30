import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';
import { UserContext } from '../providers';
import { LandingPage } from '../screens/auth/LandingPage';
import { Login } from '../screens/auth/Login';
import theme from '../../theme';
import { RootStackNavigator } from './RootNavigator';
import { useMeQuery } from '../../lib/graphql';
import { SignUp } from '../screens/auth/SignUp/SignUp';

export type AuthParamList = {
  LandingPage: undefined;
  SignUp: undefined;
  Login: undefined;
  Root: undefined;
};

// authentication screen stack
const AuthStack = createNativeStackNavigator<AuthParamList>();

// navigator props
interface AuthNavigatorProps {}

/**
 * Authentation Navigator FC
 *
 * @description
 * This renders all 3 auth screens: landing page, login page, signup page.
 * @param _ Object with isLoggedIn boolean and isLoggedIn setter
 */
export const AuthNavigator: React.FC<AuthNavigatorProps> = () => {
  const { user } = useContext(UserContext);

  return (
    <AuthStack.Navigator>
      {user === null || user === undefined ? (
        <>
          <AuthStack.Screen name="LandingPage" component={LandingPage} />
          <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ contentStyle: { backgroundColor: theme.gray[50] } }}
          />
          <AuthStack.Screen
            name="SignUp"
            component={SignUp}
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
