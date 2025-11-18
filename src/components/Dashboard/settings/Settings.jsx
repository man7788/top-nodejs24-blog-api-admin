import styles from './Settings.module.css';
import { Outlet, Link } from 'react-router';

const Settings = () => {
  return (
    <div className={styles.Settings}>
      <h1>Settings</h1>
      <Link to="/dashboard/profile">Profile</Link>
      <Link to="/dashboard/password">Password</Link>
      <Outlet />
    </div>
  );
};

export default Settings;
