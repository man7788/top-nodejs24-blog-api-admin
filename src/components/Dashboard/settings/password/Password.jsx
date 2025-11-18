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

    setFormLoading(false);
  };

  if (loading || formLoading) {
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error || submitError) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.Password}>
      <h1>Password</h1>

      <form onSubmit={submitForm}>
        <label htmlFor="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleCurrentPasswordChange}
        />
        {formError?.currentPassword && <div>{formError?.currentPassword}</div>}
        <br></br>

        <label htmlFor="newPasswrod">New Password:</label>
        <input
          type="password"
          id="newPasswrod"
          name="newPasswrod"
          value={form.newPassword}
          onChange={handleNewPasswordChange}
        />
        {formError?.newPassword && <div>{formError?.newPassword}</div>}
        <br></br>

        <label htmlFor="passwordConfirmation">Password Confirmation:</label>
        <input
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          value={form.passwordConfirmation}
          onChange={handlePasswordConfimrationChange}
        />
        {formError?.passwordConfirmation && (
          <div>{formError?.passwordConfirmation}</div>
        )}
        <br></br>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Password;
