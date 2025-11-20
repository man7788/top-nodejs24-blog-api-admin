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
          <Link to="/dashboard/posts">Posts</Link>
          <br></br>
          <Link to="/dashboard/settings">Settings</Link>
          <br></br>
          <div>{user.name}</div>
          <button onClick={logout}>Log Out</button>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
};

export default Dashboard;
