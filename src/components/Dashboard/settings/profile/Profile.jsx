import styles from './Profile.module.css';
import { useState } from 'react';
import verifyToken from '../../../../api/verifyToken';
import submitProfile from '../../../../api/submitProfile';
import useAuth from '../../../../hooks/useAuth';

const Profile = () => {
  const { user, update, setUpdate } = useAuth();
  const { error, loading } = verifyToken();

  const [submitError, setSubmitError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({ name: user.name });

  const handleNameChange = (e) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const result = await submitProfile(form.name);

    if (result.error) {
      if (result.error.details) {
        const formError = {};

        result.error.details.map((error) => {
          if (error.field === 'name') {
            formError.name = error.message;
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

    setUpdate(!update);
    setFormError({ name: 'Profile successfully updated' });
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
    <div className={styles.Profile}>
      <h2 className={styles.h2}>Profile</h2>

      <form onSubmit={submitForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="name">
            Name:
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleNameChange}
          />
          {formError?.name && (
            <div className={styles.inputError}>{formError?.name}</div>
          )}
        </div>

        <input className={styles.submit} type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Profile;
