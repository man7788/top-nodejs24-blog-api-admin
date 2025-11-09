import styles from './PrivateRoute.module.css';
import Dashboard from '../dashboard/Dashboard';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <h1 className={styles.loading}>Loading...</h1>;

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Dashboard />;
};

export default PrivateRoute;
