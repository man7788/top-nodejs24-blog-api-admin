import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import AuthContext from '../context/authContext';
import verifyToken from '../api/verifyToken';

function AuthProvider({ children }, props) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const result = await verifyToken();

      if (result.error) {
        setLoading(false);
        setError(result.error);
        return;
      }

      if (result.user) {
        setLoading(false);
        setUser(result.user);
        return;
      }
    };

    verifyUser();
  }, [update]);

  const login = async () => {
    const result = await verifyToken();

    if (result.error) {
      setError(result.error);
      return result.error;
    }

    if (result.user) {
      setUser(result.user);
      navigate('/dashboard', { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, update, setUpdate }}
      {...props}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
