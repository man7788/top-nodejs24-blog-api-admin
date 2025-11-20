import styles from './PostEdit.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
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
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error || submitError) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.PostEdit}>
      <h1>Edit</h1>
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

export default PostEdit;
