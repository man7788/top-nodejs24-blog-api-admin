const submitPassword = async (
  currentPassword,
  newPassword,
  passwordConfirmation,
) => {
  const token = localStorage.getItem('token');
  const payload = { currentPassword, newPassword, passwordConfirmation };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      mode: 'cors',
    });

    if (response.status === 400 || response.status === 401) {
      const result = await response.json();
      return result;
    }

    if (response.status > 400) {
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

export default submitPassword;
