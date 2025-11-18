import ErrorPage from '../components/error/ErrorPage';
import App from '../App';
import Login from '../components/login/Login';
import AuthLayout from '../components/authLayout/AuthLayout';
import PrivateRoute from '../components/privateRoute/PrivateRoute';
import Overview from '../components/dashboard/overview/Overview';
import Settings from '../components/dashboard/settings/Settings';
import Profile from '../components/dashboard/settings/profile/Profile';
import Password from '../components/dashboard/settings/password/Password';

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
          {
            path: 'settings',
            element: <Settings />,
            children: [{ index: true, element: <Profile /> }],
          },
          {
            path: 'profile',
            element: <Settings />,
            children: [{ index: true, element: <Profile /> }],
          },
          {
            path: 'password',
            element: <Settings />,
            children: [{ index: true, element: <Password /> }],
          },
        ],
      },
    ],
  },
];

export default routes;
