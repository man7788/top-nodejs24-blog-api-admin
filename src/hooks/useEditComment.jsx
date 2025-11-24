import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const useEditComment = (postId) => {
  const { commentId } = useParams();

  const [comment, setComment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${postId}/comments/${commentId}`,
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
        const data = result.data.comment;

        setComment(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, commentId]);

  return { comment, error, loading };
};

export default useEditComment;
