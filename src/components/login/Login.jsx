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
      <main className={styles.Login}>
        <h1 className={styles.altHeader}>Blog API</h1>
        <div className={styles.altMessage}>Loading...</div>
      </main>
    );

  if (error) {
    return (
      <main className={styles.Login}>
        <h1 className={styles.altHeader}>Blog API</h1>
        <div className={styles.altMessage}>A network error was encountered</div>
      </main>
    );
  }

  return (
    <main className={styles.Login}>
      <h1 className={styles.header}>Blog API</h1>
      <form className={styles.form} onSubmit={submitForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email:
          </label>
          <input
            className={styles.input}
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={handleEmailChange}
          />
          {formError?.email && (
            <div className={styles.errorMessage}>{formError?.email}</div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handlePasswordChange}
          />
          {formError?.password && (
            <div className={styles.errorMessage}>{formError?.password}</div>
          )}
          {formError?.generic && (
            <div className={styles.errorMessage}>{formError?.generic}</div>
          )}
        </div>
        <input className={styles.submit} type="submit" value="Log In" />
      </form>
    </main>
  );
};

export default Login;
