import styles from './PostCreate.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
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
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error || submitError) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.PostCreate}>
      <h1>Create</h1>
      <form onSubmit={submitForm}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleTitleChange}
        />
        {formError?.title && <div>{formError?.title}</div>}

        <label htmlFor="content">Content:</label>
        <textarea
          type="text"
          id="content"
          name="content"
          value={form.content}
          onChange={handleContentChange}
        />
        {formError?.content && <div>{formError?.content}</div>}

        <label>
          Status:
          <select
            name="status"
            value={form.published}
            onChange={handleStatusChange}
          >
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default PostCreate;
