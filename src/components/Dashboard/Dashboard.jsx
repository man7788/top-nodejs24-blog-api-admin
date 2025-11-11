import styles from './Dashboard.module.css';
import { Outlet, Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.Dashboard}>
      <h1>Dashboard</h1>
      <aside>
        <nav>
          <Link to="/dashboard">Overview</Link>
          <br></br>
          <Link to="/dashboard/account">Account</Link>
          <br></br>
          <Link to="/dashboard/account">{user.name}</Link>
          <br></br>
          <button onClick={logout}>Log Out</button>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
};

export default Dashboard;
