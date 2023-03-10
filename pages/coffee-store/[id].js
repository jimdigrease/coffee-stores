import { useRouter } from 'next/router';
import { Fragment, useContext, useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';

import styles from '../../styles/coffee-store.module.css';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils/util';

function CoffeeStore(initialProps) {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});
  const router = useRouter();
  const id = router.query.id;
  const { state: { coffeeStores } } = useContext(StoreContext);

  //https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react/72238236#72238236
  useEffect(() => {
    const abortController = new AbortController();

    async function handleCreateCoffeeStore(coffeeStore) {
      try {
        const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
  
        const response = await fetch('/api/createCoffeeStore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            name,
            voting: voting || 0,
            imgUrl,
            neighbourhood: neighbourhood || '',
            address: address || '',
          }),
          signal: abortController.signal
        });
  
        const dbCoffeeStore = await response.json();
      } catch (error) {
        if (error.name !== 'AbortError') {
          /* Logic for non-aborted error handling goes here. */
          console.error('Could not save Coffee Store in database', error);
        }
      }
    };

    if (initialProps.coffeeStore && isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });

        setCoffeeStore(coffeeStoreFromContext);
        handleCreateCoffeeStore(coffeeStoreFromContext);
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }

    return () => abortController.abort();
  }, []);

  const { address, neighbourhood, name,  imgUrl } = coffeeStore;
  const [votingCount, setVotingCount] = useState(0);

  // SWR part
  const fetcher = (url) => fetch(url).then((res) => res.json());;
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  
  useEffect(() => {
    if (data) {
      setCoffeeStore(data);
      setVotingCount(data.voting);
    }
  }, [data]);

  async function handleUpVoteButton() {
    try {
      const response = await fetch('/api/upVoteCoffeeStore', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      let count = votingCount + 1;
      setVotingCount(count);

    } catch (error) {
      console.error('Could not upvote Coffee Store in database', error);
    }   
  };

  let pageHeadData = (
    <Head>
      <title>{name} - Coffee Connoisseur</title>
      <meta 
        name="description"
        content={`The page of ${name} venue on the Coffee Connoisseur site`}
      />
    </Head>
  );

  if (router.isFallback) {
    return (
      <Fragment>
        {pageHeadData}
        <div> Loading...</div>
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        {pageHeadData}
        <div>Something went wrong retrieving coffee store page</div>
      </Fragment>
    );
  }
  
  return (
    <div className={styles.layout}>
      {pageHeadData}
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">??? Back to Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name || 'coffee store image'}
            ></Image>
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/images/icons/places.svg" width="24" height="24" alt="places icon" />
            <p className={styles.text}>{address}</p>
          </div>

          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src="/images/icons/nearMe.svg" width="24" height="24" alt="near me icon" />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/images/icons/star.svg" width="24" height="24" alt="star icon" />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

export async function getStaticProps(staticProps) {
  const coffeeStores = await fetchCoffeeStores();

  const coffeeStoreById = coffeeStores.find((coffeeStore) => {
    const params = staticProps.params;
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: coffeeStoreById ? coffeeStoreById : {}
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });

  return {
    paths,
    fallback: true,
  };
}
