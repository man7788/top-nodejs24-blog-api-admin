import styles from './App.module.css';
import { Navigate } from 'react-router';
import useAuth from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={styles.App}>
      {user ? (
        <Navigate to="/dashboard" replace={true} />
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
}

export default App;
