import styles from './PostCreate.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import useVerifyToken from '../../../../hooks/useVerifyToken';
import submitPostCreate from '../../../../api/submitPostCreate';

const PostCreate = () => {
  const navigate = useNavigate();
  const { error, loading } = useVerifyToken();

  const [submitError, setSubmitError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    published: false,
  });

  const handleTitleChange = (e) => {
    setForm({
      ...form,
      title: e.target.value,
    });
  };

  const handleContentChange = (e) => {
    setForm({
      ...form,
      content: e.target.value,
    });
  };

  const handleStatusChange = (e) => {
    const published = e.target.value === 'true' ? true : false;

    setForm({
      ...form,
      published,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const result = await submitPostCreate(
      form.title,
      form.content,
      form.published,
    );

    if (result.error) {
      if (result.error.details) {
        const formError = {};

        result.error.details.map((error) => {
          if (error.field === 'title') {
            formError.title = error.message;
          } else if (error.field === 'content') {
            formError.content = error.message;
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
    navigate('/dashboard/posts');
  };

  if (loading || formLoading) {
    return <div className={styles.altMessage}>loading...</div>;
  }

  if (error?.statusCode === 401) {
    return <div className={styles.altMessage}>401 - Unauthorized</div>;
  }

  if (error || submitError) {
    return (
      <div className={styles.altMessage}>A network error was encountered</div>
    );
  }

  return (
    <section className={styles.PostCreate}>
      <div className={styles.header}>
        <h2 className={styles.h2}>Create</h2>
      </div>
      <form className={styles.form} onSubmit={submitForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input
            className={styles.input}
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleTitleChange}
          />
          {formError?.title && (
            <div className={styles.inputError}>{formError?.title}</div>
          )}
        </div>
        <div className={styles.textareaGroup}>
          <label className={styles.label} htmlFor="content">
            Content
          </label>
          <textarea
            className={styles.textarea}
            type="text"
            id="content"
            name="content"
            value={form.content}
            onChange={handleContentChange}
          />
          {formError?.content && (
            <div className={styles.inputError}>{formError?.content}</div>
          )}
        </div>
        <div className={styles.selectGroup}>
          <label className={styles.label} htmlFor="status">
            Status
          </label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              name="status"
              value={form.published}
              onChange={handleStatusChange}
            >
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <input className={styles.submit} type="submit" value="Submit" />
        </div>
      </form>
      <div className={styles.buttonContainer}>
        <Link to="/dashboard/posts">
          <button className={styles.cancel}>Cancel</button>
        </Link>
      </div>
    </section>
  );
};

export default PostCreate;
