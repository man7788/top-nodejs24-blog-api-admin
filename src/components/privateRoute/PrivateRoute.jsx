import styles from './PrivateRoute.module.css';
import Dashboard from '../dashboard/Dashboard';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = () => {
  const { user, error, loading } = useAuth();

  if (loading) {
    return (
      <main className={styles.PrivateRoute}>
        <h1 className={styles.header}>Blog API</h1>
        <div className={styles.message}>Loading...</div>
      </main>
    );
  }

  if (error?.statusCode === 401) {
    return (
      <main className={styles.PrivateRoute}>
        <h1 className={styles.header}>Blog API</h1>
        <div className={styles.message}>401 - Unauthorized</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.PrivateRoute}>
        <h1 className={styles.header}>Blog API</h1>
        <div className={styles.message}>A network error was encountered</div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Dashboard />;
};

export default PrivateRoute;
