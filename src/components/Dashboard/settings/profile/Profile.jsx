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
    <div className={styles.Profile}>
      <h1>Profile</h1>

      <form onSubmit={submitForm}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleNameChange}
        />
        {formError?.name && <div>{formError?.name}</div>}

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Profile;
