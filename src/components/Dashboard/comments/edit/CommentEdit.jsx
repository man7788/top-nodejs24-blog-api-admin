import styles from './CommentEdit.module.css';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router';
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
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error || submitError) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.CommentEdit}>
      <h1>Edit</h1>
      <form onSubmit={submitForm}>
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

export default CommentEdit;
