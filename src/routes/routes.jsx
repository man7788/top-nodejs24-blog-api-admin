import App from '../App';
import ErrorPage from '../components/error/ErrorPage';
import Login from '../components/login/Login';
import Dashboard from '../components/dashboard/Dashboard';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
