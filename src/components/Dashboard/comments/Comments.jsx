import styles from './Comments.module.css';
import { Outlet } from 'react-router';

const Comments = () => {
  return (
    <div className={styles.Comments}>
      <Outlet />
    </div>
  );
};

export default Comments;
