import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const useEditPosts = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${postId}/admin`,
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
        const data = result.data.post;

        setPost(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  return { post, error, loading };
};

export default useEditPosts;
