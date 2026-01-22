import styles from './ErrorPage.module.css';
import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <main className={styles.ErrorPage}>
      <h1 className={styles.header}>Blog API</h1>
      <div className={styles.message}>404 - Page not found</div>
      <Link to="/" className={styles.home}>
        Return Home
      </Link>
    </main>
  );
};

export default ErrorPage;
