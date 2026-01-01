import styles from './Posts.module.css';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';

const Posts = () => {
  const [showCreate, setShowCreate] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (path[3] !== undefined) {
      setShowCreate(false);
    } else {
      setShowCreate(true);
    }
  }, [location.pathname]);

  return (
    <main className={styles.Posts}>
      <div className={styles.header}>
        <h1>Posts</h1>
        {showCreate && (
          <Link to="create">
            <button className={styles.create}>Create</button>
          </Link>
        )}
      </div>
      <Outlet />
    </main>
  );
};

export default Posts;
