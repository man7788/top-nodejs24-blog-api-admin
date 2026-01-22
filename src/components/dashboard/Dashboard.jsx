import styles from './Dashboard.module.css';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const [popup, setPopup] = useState(false);
  const [curentPage, setCurentPage] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/');

    if (path[2] === undefined) {
      return setCurentPage('overview');
    }

    if (path.includes('settings', 'profile', 'password')) {
      setCurentPage('settings');
    } else {
      setCurentPage(path[2]);
    }
  }, [location.pathname]);

  const showPopup = () => {
    setPopup(!popup);
  };

  const handleBlur = () => {
    setPopup(false);
  };

  return (
    <div className={styles.Dashboard}>
      <aside className={styles.aside}>
        <h1 className={styles.header}>Dashboard</h1>
        <nav className={styles.nav}>
          <Link
            className={
              curentPage === 'overview' ? styles.linkHightlight : styles.link
            }
            to="/dashboard"
          >
            Overview
          </Link>
          <Link
            className={
              curentPage === 'posts' ? styles.linkHightlight : styles.link
            }
            to="/dashboard/posts"
          >
            Posts
          </Link>
          <Link
            className={
              curentPage === 'comments' ? styles.linkHightlight : styles.link
            }
            to="/dashboard/comments"
          >
            Comments
          </Link>
          <Link
            className={
              curentPage === 'settings' ? styles.linkHightlight : styles.link
            }
            to="/dashboard/settings"
          >
            Settings
          </Link>
          {popup && (
            <div className={styles.popup}>
              <button className={styles.popupButton} onMouseDown={logout}>
                Log Out
              </button>
            </div>
          )}
          <button
            className={styles.more}
            onClick={showPopup}
            onBlur={handleBlur}
          >
            More
          </button>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
};

export default Dashboard;
