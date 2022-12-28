import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/Banner';
import Card from '../components/UI/Card';
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
        <div className={styles.heroImage}>
          <Image src="/images/hero-image.png" width={700} height={400} alt="Hero Image" />
        </div>
        <div className={styles.cardLayout}>
          <Card className={styles.card} />
        </div>
      </main>
    </div>
  );
}
