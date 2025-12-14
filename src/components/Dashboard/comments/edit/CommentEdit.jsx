import styles from './CommentEdit.module.css';
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router';
import useEditComment from '../../../../hooks/useEditComment';
import submitCommentUpdate from '../../../../api/submitCommentUpdate';

const CommentEdit = () => {
  const { commentId } = useParams();
  const { state } = useLocation(); // State from comment list item
  const { comment, error, loading } = useEditComment(state.postId, commentId);

  const [submitError, setSubmitError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    content: '',
    published: false,
  });

  useEffect(() => {
    if (comment) {
      setForm({
        content: comment.content,
        published: comment.published,
      });
    }
  }, [comment]);

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

    const result = await submitCommentUpdate(
      state.postId,
      commentId,
      form.content,
      form.published,
    );

    if (result.error) {
      if (result.error.details) {
        const formError = {};

        result.error.details.map((error) => {
          if (error.field === 'content') {
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
    <section className={styles.CommentEdit}>
      <div className={styles.header}>
        <h2 className={styles.h2}>Post: {comment.post?.title}</h2>
        <h3 className={styles.h3}>Comment author: {comment.name}</h3>
      </div>
      <form className={styles.form} onSubmit={submitForm}>
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
        <Link to="/dashboard/comments">
          <button className={styles.cancel}>Cancel</button>
        </Link>
      </div>
    </section>
  );
};

export default CommentEdit;
