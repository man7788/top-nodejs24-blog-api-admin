import styles from './PostEdit.module.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import useEditPosts from '../../../../hooks/useEditPost';
import submitPostUpdate from '../../../../api/submitPostUpdate';

const PostEdit = () => {
  const { postId } = useParams();
  const { post, error, loading } = useEditPosts();

  const [submitError, setSubmitError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    published: false,
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        content: post.content,
        published: post.published,
      });
    }
  }, [post]);

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

    const result = await submitPostUpdate(
      postId,
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
          } else if (error.field === 'published') {
            formError.published = error.message;
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
    return <h2 className={styles.h2}>loading...</h2>;
  }

  if (error?.statusCode === 401) {
    return <h2 className={styles.h2}>401 - Unauthorized</h2>;
  }

  if (error || submitError) {
    return <h2 className={styles.h2}>A network error was encountered</h2>;
  }

  return (
    <section className={styles.PostEdit}>
      <h2 className={styles.h2}>Edit</h2>
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
          <label className={styles.label}>Status</label>
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

        <input className={styles.submit} type="submit" value="Submit" />
      </form>

      <Link to="/dashboard/posts">
        <button className={styles.cancel}>Cancel</button>
      </Link>
    </section>
  );
};

export default PostEdit;
