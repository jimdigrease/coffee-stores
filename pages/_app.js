import Head from 'next/head';

import StoreProvider from "../store/store-context";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta 
          name="description" 
          content="Coffee Connoisseur is the site where you can find a lot of great Coffee shops and cafes, that allow you to get most of Coffee-world or to communicate with your friends and colleagues or just to do rest on your own!"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp
