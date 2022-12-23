import Head from 'next/head';

import Banner from '../components/Banner';
import styles from '../styles/Home.module.css';

export default function Home() {

  function onClickBannerBtnHandler() {}

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Coffee Connoisseur is the site where you can find all of your beloved coffe-shops and places to rest." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View stores nearby" onClick={onClickBannerBtnHandler} />
      </main>
    </div>
  );
}
