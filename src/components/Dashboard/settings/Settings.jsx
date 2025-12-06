import styles from './Settings.module.css';
import { useState, useEffect } from 'react';
import { useLocation, Outlet, Link } from 'react-router';

const Settings = () => {
  const [curentPage, setCurentPage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (path[2] === 'settings' || path[2] === 'profile') {
      setCurentPage('profile');
    } else if (path[2] === 'password') {
      setCurentPage('password');
    }
  }, [location.pathname]);

  return (
    <main className={styles.Settings}>
      <section className={styles.header}>
        <h1>Settings</h1>
      </section>
      <nav className={styles.nav}>
        <Link
          className={
            curentPage === 'profile' ? styles.linkHighlight : styles.link
          }
          to="/dashboard/profile"
        >
          Profile
        </Link>
        <Link
          className={
            curentPage === 'password' ? styles.linkHighlight : styles.link
          }
          to="/dashboard/password"
        >
          Password
        </Link>
      </nav>
      <Outlet />
    </main>
  );
};

export default Settings;
