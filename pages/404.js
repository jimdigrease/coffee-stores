import Link from 'next/link';

import styles from '../styles/coffee-store.module.css';

function NotFoundPage() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.col1}>
          <h1>Page not found!</h1>
          <h3>Page you are trying to open is not exists, please enter another address or you can</h3>
          <Link href="/" className={styles.backToHomeLink}><h3>← Back to Home</h3></Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
