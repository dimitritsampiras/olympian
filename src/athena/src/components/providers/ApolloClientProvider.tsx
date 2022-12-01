import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import React, { ReactNode } from 'react';

import { setContext } from '@apollo/client/link/context';
import { GraphQLErrors, NetworkError } from '@apollo/client/errors';

// @ts-ignore
import { PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN } from '../../lib/constants';

interface ApolloClientProviderProps {
  children: ReactNode | ReactNode[];
}

export const ApolloClientProvider: React.FC<ApolloClientProviderProps> = ({ children }) => {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const createApolloClient = () => {
  // const uri = `http://${IP_ADDRESS}:${PORT}/graphql`;
  const uri = `http://${'localhost'}:${PORT}/graphql`;
  // servers links
  const httpLink = createHttpLink({ uri });

  // global handle errors
  const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    // handle graphql erros if there are any
    if (graphQLErrors) handleGqlErrors(graphQLErrors);

    // handle network errors if there are any
    if (networkError) handleNetworkErrors(networkError);

    console.log('res', response?.data?.errors);
  });

  const authLink = setContext(async (_req, { headers }) => {
    const authToken = await retrieveToken();
    const authorization = authToken ? `Bearer ${authToken}` : '';
    return { headers: { ...headers, authorization } };
  });

  return new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
  });
};
/**
 * An error handler for GraphQL errors.
 * @param errors Graphql errors that occur
 */
export const handleGqlErrors = (errors: GraphQLErrors) => {
  errors.forEach((error) => {
    const name = `Graphql Error: ${error.name}`;
    const message = `Message: ${error.message}, Location: ${JSON.stringify(
      error.locations
    )}, Path: ${error.path}, ${error.toString}`;

    // console log for dev
    console.log(name, message);
  });
};

/**
 * An error handler for network errors.
 * @param error The network error that occurs.
 */
export const handleNetworkErrors = (error: NonNullable<NetworkError>) => {
  const name = `Network Error: ${error.name}`;
  const message = `Message: ${error.message}, Cause: ${error.cause}`;

  // console log for dev
  console.log(name, message, error);
};

export const retrieveToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(AUTH_TOKEN);
};
