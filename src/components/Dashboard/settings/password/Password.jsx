import styles from './Password.module.css';
import { useState } from 'react';
import useVerifyToken from '../../../../hooks/useVerifyToken';
import submitPassword from '../../../../api/submitPassword';

const Password = () => {
  const { error, loading } = useVerifyToken();

  const [submitError, setSubmitError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  });

  const handleCurrentPasswordChange = (e) => {
    setForm({
      ...form,
      currentPassword: e.target.value,
    });
  };

  const handleNewPasswordChange = (e) => {
    setForm({
      ...form,
      newPassword: e.target.value,
    });
  };

  const handlePasswordConfimrationChange = (e) => {
    setForm({
      ...form,
      passwordConfirmation: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const result = await submitPassword(
      form.currentPassword,
      form.newPassword,
      form.passwordConfirmation,
    );

    if (result.error) {
      if (result.error.details) {
        const formError = {};

        result.error.details.map((error) => {
          if (error.field === 'currentPassword') {
            formError.currentPassword = error.message;
          } else if (error.field === 'newPassword') {
            formError.newPassword = error.message;
          } else if (error.field === 'passwordConfirmation') {
            formError.passwordConfirmation = error.message;
          }
        });

        setFormError(formError);
        setFormLoading(false);
        return;
      } else {
        setSubmitError(true);
        setFormLoading(false);
        return;
      }
    }

    setForm({
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    });
    setFormError({ currentPassword: 'Password successfully updated' });
    setFormLoading(false);
  };

  if (loading || formLoading) {
    return <h2 className={styles.h2}>loading...</h2>;
  }

  if (error?.statusCode === 401) {
    return <h2 className={styles.h2}>401 - Unauthorized</h2>;
  }

  if (error || submitError) {
    return <h2 className={styles.h2}>A network error was encountered</h2>;
  }

  return (
    <div className={styles.Password}>
      <form onSubmit={submitForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="currentPassword">
            Current Password:
          </label>
          <input
            className={styles.input}
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleCurrentPasswordChange}
          />
          {formError?.currentPassword && (
            <div className={styles.inputError}>
              {formError?.currentPassword}
            </div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="newPassword">
            New Password:
          </label>
          <input
            className={styles.input}
            type="password"
            id="newPassword"
            name="newPassword"
            value={form.newPassword}
            onChange={handleNewPasswordChange}
          />
          {formError?.newPassword && (
            <div className={styles.inputError}>{formError?.newPassword}</div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="passwordConfirmation">
            Password Confirmation:
          </label>
          <input
            className={styles.input}
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={form.passwordConfirmation}
            onChange={handlePasswordConfimrationChange}
          />
          {formError?.passwordConfirmation && (
            <div className={styles.inputError}>
              {formError?.passwordConfirmation}
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <input className={styles.submit} type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Password;
