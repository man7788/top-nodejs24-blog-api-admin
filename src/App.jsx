import styles from './App.module.css';
import { Navigate } from 'react-router';
import useAuth from './hooks/useAuth';

function App() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <main className={styles.App}>
        <h1 className={styles.header}>Blog API</h1>
        <div className={styles.message}>Loading...</div>
      </main>
    );
  }

  if (error.statusCode === 401) {
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

  if (error) {
    return (
      <main className={styles.App}>
        <h1 className={styles.header}>Blog API</h1>
        <div className={styles.message}>A network error was encountered</div>
      </main>
    );
  }
}

export default App;
