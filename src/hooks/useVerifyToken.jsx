import { useState, useEffect } from 'react';

const useVerifyToken = () => {
  const [auth, setAuth] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          headers: { Authorization: `Bearer ${token}` },
          mode: 'cors',
        });

        if (response.status === 401) {
          const result = await response.json();
          const error = new Error(result.error.message);
          error.statusCode = 401;
          throw error;
        }

        if (response.status >= 400) {
          const result = await response.json();
          throw new Error(result.error.message);
        }

        const result = await response.json();
        const data = result.data.user;

        setAuth(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { auth, error, loading };
};

export default useVerifyToken;
