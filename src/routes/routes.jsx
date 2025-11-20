import ErrorPage from '../components/error/ErrorPage';
import App from '../App';
import Login from '../components/login/Login';
import AuthLayout from '../components/authLayout/AuthLayout';
import PrivateRoute from '../components/privateRoute/PrivateRoute';
// Overview
import Overview from '../components/dashboard/overview/Overview';
// Settings
import Settings from '../components/dashboard/settings/Settings';
import Profile from '../components/dashboard/settings/profile/Profile';
import Password from '../components/dashboard/settings/password/Password';
// Posts
import Posts from '../components/dashboard/posts/Posts';
import PostList from '../components/dashboard/posts/list/PostList';
import PostEdit from '../components/dashboard/posts/edit/PostEdit';

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
            path: 'posts',
            element: <Posts />,
            children: [
              { index: true, element: <PostList /> },
              { path: ':postId/edit', element: <PostEdit /> },
            ],
          },
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
