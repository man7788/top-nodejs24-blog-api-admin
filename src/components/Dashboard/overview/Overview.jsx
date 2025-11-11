import styles from './Overview.module.css';
import { Navigate } from 'react-router';
import usePosts from '../../../hooks/usePosts';

const Overview = () => {
  const { posts, error, loading } = usePosts();

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <Navigate to="/login" replace={true} />;
  }

  if (error) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.Overview}>
      <h1>Overview</h1>
      <p>Total Posts: {posts?.length}</p>
    </div>
  );
};

export default Overview;
