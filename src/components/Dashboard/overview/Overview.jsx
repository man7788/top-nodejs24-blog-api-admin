import styles from './Overview.module.css';
import usePosts from '../../../hooks/usePosts';

const Overview = () => {
  const { posts, error, loading } = usePosts();

  if (loading) {
    return <h1 className={styles.h1}>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1 className={styles.h1}>401 - Unauthorized</h1>;
  }

  if (error) {
    return <h1 className={styles.h1}>A network error was encountered</h1>;
  }

  return (
    <main className={styles.Overview}>
      <section className={styles.header}>
        <h1>Overview</h1>
      </section>
      <section className={styles.section}>
        <h2 className={styles.h2}>Statistics</h2>
        <p className={styles.p}>{posts?.length} posts</p>
      </section>
    </main>
  );
};

export default Overview;
