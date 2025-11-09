import ErrorPage from '../components/error/ErrorPage';
import App from '../App';
import Login from '../components/login/Login';
import AuthLayout from '../components/authLayout/AuthLayout';
import PrivateRoute from '../components/privateRoute/PrivateRoute';
import Overview from '../components/dashboard/overview/Overview';
import Account from '../components/dashboard/account/Account';

const routes = [
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
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
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'account', element: <Account /> },
        ],
      },
    ],
  },
];

export default routes;
