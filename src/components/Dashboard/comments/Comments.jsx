import styles from './Comments.module.css';
import { Outlet } from 'react-router';

const Comments = () => {
  return (
    <main className={styles.Comments}>
      <section className={styles.header}>
        <h1 className={styles.h1}>Comments</h1>
      </section>
      <Outlet />
    </main>
  );
};

export default Comments;
