import { useState, useEffect } from 'react';

const useComments = () => {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [update, setUpate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/comments/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
            mode: 'cors',
          },
        );

        if (response.status === 401) {
          const result = await response.json();
          const error = new Error(result.error.message);
          error.statusCode = result.error.code;
          throw error;
        }

        if (response.status > 400) {
          const result = await response.json();
          throw new Error(result.error.message);
        }

        const result = await response.json();
        const data = result.data.comments;

        setComments(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [update]);

  return { comments, error, loading, update, setUpate };
};

export default useComments;
