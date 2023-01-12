import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/Banner';
import Card from '../components/UI/Card';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import styles from '../styles/Home.module.css';

export default function Home(props) {
  const { coffeeStores } = props;

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
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores }
  };
}
