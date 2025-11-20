import styles from './Posts.module.css';
import { Outlet } from 'react-router';

const Posts = () => {
  return (
    <div className={styles.Posts}>
      <Outlet />
    </div>
  );
};

export default Posts;
