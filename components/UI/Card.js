import Link from 'next/link';
import Image from 'next/image';
import cls from 'classnames';

import styles from './card.module.css';

function Card(props) {
  return (
    <Link href={props.href}>
      <div className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
              alt={props.name}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
