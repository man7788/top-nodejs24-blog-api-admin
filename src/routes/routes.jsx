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
import PostCreate from '../components/dashboard/posts/create/PostCreate';
// Comments
import Comments from '../components/dashboard/comments/Comments';
import CommentList from '../components/dashboard/comments/list/CommentList';
import CommentEdit from '../components/dashboard/comments/edit/CommentEdit';

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
              { path: 'create', element: <PostCreate /> },
            ],
          },
          {
            path: 'comments',
            element: <Comments />,
            children: [
              { index: true, element: <CommentList /> },
              { path: ':commentId/edit', element: <CommentEdit /> },
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
