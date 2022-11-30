import { AppProps } from 'next/app';
import { Header } from '../components';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import Head from 'next/head';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        
      </Head>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
