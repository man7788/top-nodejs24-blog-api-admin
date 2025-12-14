import styles from './Comments.module.css';
import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router';

const Comments = () => {
  const [edit, setEdit] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (path[4] === undefined) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [location.pathname]);

  return (
    <main className={edit ? styles.CommentsEdit : styles.Comments}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Comments</h1>
      </header>
      <Outlet />
    </main>
  );
};

export default Comments;
