import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';

import Banner from '../components/Banner';
import Card from '../components/UI/Card';
import useTrackLocation from '../hooks/use-track-location';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import styles from '../styles/Home.module.css';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export default function Home(props) {
  const { 
    handleTrackLocation, 
    locationErrorMsg, 
    isFindingLocation 
  } = useTrackLocation();
  //const [coffeeStores, setCoffeeStores] = useState('');

  const { dispatch, state } = useContext(StoreContext); 
  const { coffeeStores, latLong } = state;

  console.log({ latLong, locationErrorMsg });

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores }
          })
          console.log({ fetchedCoffeeStores });
        } catch(err) {
          console.log(err);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  function onClickBannerBtnHandler() {
    handleTrackLocation();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Coffee Connoisseur is the site where you can find all of your beloved coffe-shops and places to rest." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner 
          buttonText={isFindingLocation ? "Loading..." : "View stores nearby"} 
          onClick={onClickBannerBtnHandler} 
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image src="/images/hero-image.png" width={700} height={400} alt="Hero Image" />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee stores near you</h2>
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

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
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
