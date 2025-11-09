import { Outlet } from 'react-router';
import AuthProvider from '../../providers/authProvider';

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthLayout;
