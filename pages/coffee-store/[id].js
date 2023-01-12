import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';

import styles from '../../styles/coffee-store.module.css';
import { fetchCoffeeStores } from '../../lib/coffee-stores';

export async function getStaticProps(staticProps) {
  const coffeeStores = await fetchCoffeeStores();

  const coffeeStore = coffeeStores.find((coffeeStore) => {
    const params = staticProps.params;
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore
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

function CoffeeStore (props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div> Loading...</div>;
  }

  const { address, neighbourhood, name,  imgUrl } = props.coffeeStore;

  function handleUpVoteButton () {
    console.log("handleUpVoteButton");
  };
  
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to Home</Link>
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
              alt={name}
            ></Image>
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/images/icons/places.svg" width="24" height="24" alt="" />
            <p className={styles.text}>{address}</p>
          </div>

          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src="/images/icons/nearMe.svg" width="24" height="24" alt="" />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/images/icons/star.svg" width="24" height="24" alt="star icon" />
            <p className={styles.text}>1</p>
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
