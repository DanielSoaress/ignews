import { AppProps } from 'next/app';
import { Header } from '../components';
import Head from 'next/head';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
