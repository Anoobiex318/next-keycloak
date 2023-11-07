// pages/_app.tsx
import { AppProps } from 'next/app';
import { SessionProvider as AuthProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Use the SessionProvider from next-auth/react
    <AuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
