const verifyToken = async () => {
  const token = localStorage.getItem('token');

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
    const data = result.data;

    return data;
  } catch (error) {
    return { error };
  }
};

export default verifyToken;
