import styles from './Login.module.css';
import { useState } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import submitLogin from '../../api/submitLogin';

const Login = () => {
  const { user, login, loading } = useAuth();

  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleEmailChange = (e) => {
    setForm({
      ...form,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setForm({
      ...form,
      password: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const result = await submitLogin(form.email, form.password);

    if (result.error) {
      if (result.error.details) {
        const formError = {};

        result.error.details.map((error) => {
          if (error.field === 'email') {
            formError.email = error.message;
          } else if (error.field === 'password') {
            formError.password = error.message;
          } else if (error.field === 'generic') {
            formError.generic = error.message;
          }
        });

        setFormError(formError);
        setFormLoading(false);
        return;
      } else {
        setError(true);
        setFormLoading(false);
        return;
      }
    }

    localStorage.setItem('token', result.token);

    const loginError = await login();

    if (loginError) {
      setError(true);
      setFormLoading(false);
      return;
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  if (loading || formLoading)
    return (
      <main>
        <h1 className={styles.title}>Login</h1>
        <h2>Loading...</h2>
      </main>
    );

  if (error) {
    return (
      <main>
        <h1 className={styles.title}>Login</h1>
        <h2>A network error was encountered</h2>
      </main>
    );
  }

  return (
    <main className={styles.Login}>
      <h1>Login</h1>

      <form onSubmit={submitForm}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={form.email}
          onChange={handleEmailChange}
        />
        {formError?.email && <div>{formError?.email}</div>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handlePasswordChange}
        />
        {formError?.password && <div>{formError?.password}</div>}

        <input type="submit" value="Submit" />
        {formError?.generic && <div>{formError?.generic}</div>}
      </form>
    </main>
  );
};

export default Login;
