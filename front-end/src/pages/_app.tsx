import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { MantineProvider, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { graphqlClient } from '../graphql/apollo';
import { AuthProvider, SnackbarProvider } from '../contexts';
import { Topbar } from '../components';
import { routes } from '../routes';
import { mantineTheme } from '../utils';
import { FavoritesCacheProvider } from '../components/FavoritesCacheProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <SnackbarProvider>
        <ApolloProvider client={graphqlClient}>
          <AuthProvider>
            <FavoritesCacheProvider>
              <Topbar routes={routes} />
              <Container>
                <Component {...pageProps} />
              </Container>
            </FavoritesCacheProvider>
          </AuthProvider>
        </ApolloProvider>
      </SnackbarProvider>
      <Notifications />
    </MantineProvider>
  );
}
