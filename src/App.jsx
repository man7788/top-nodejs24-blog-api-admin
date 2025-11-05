import styles from './App.module.css';
import { Navigate } from 'react-router';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className={styles.App}>
      <h1>Dashboard</h1>
      {token ? (
        <Navigate to="/dashboard" replace={true} />
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
}

export default App;
