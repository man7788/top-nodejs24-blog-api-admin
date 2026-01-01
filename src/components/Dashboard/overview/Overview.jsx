import styles from './Overview.module.css';
import usePosts from '../../../hooks/usePosts';

const Overview = () => {
  const { posts, error, loading } = usePosts();

  if (loading) {
    return (
      <main className={styles.Overview}>
        <h1 className={styles.header}>Overview</h1>
        <div className={styles.message}>Loading...</div>
      </main>
    );
  }

  if (error?.statusCode === 401) {
    return (
      <main className={styles.Overview}>
        <h1 className={styles.header}>Overview</h1>
        <div className={styles.message}>401 - Unauthorized</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.Overview}>
        <h1 className={styles.header}>Overview</h1>
        <div className={styles.message}>A network error was encountered</div>
      </main>
    );
  }

  return (
    <main className={styles.Overview}>
      <h1 className={styles.header}>Overview</h1>
      <article className={styles.card}>
        <header>
          <h2 className={styles.infoHeader}>Statistics</h2>
        </header>
        <div className={styles.infoMessage}>{posts?.length} posts</div>
      </article>
    </main>
  );
};

export default Overview;
