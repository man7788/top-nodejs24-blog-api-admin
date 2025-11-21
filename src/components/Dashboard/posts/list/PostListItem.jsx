import styles from './PostListItem.module.css';
import { Link } from 'react-router';
import submitPostDelete from '../../../../api/submitPostDelete';

const PostListItem = ({
  post,
  setListError,
  setListLoading,
  update,
  setUpate,
}) => {
  const submitDelete = async (e) => {
    e.preventDefault();

    setListLoading(true);

    const result = submitPostDelete(post.id);

    if (result.error) {
      setListError(true);
      setListLoading(false);
      return;
    }

    setUpate(!update);
    setListLoading(false);
  };

  return (
    <div className={styles.PostListItem}>
      <ul>
        <li>{post.title}</li>
        <Link to={`${post.id}/edit`}>Edit</Link>
        <form onSubmit={submitDelete}>
          <input type="submit" value="Delete" />
        </form>
      </ul>
    </div>
  );
};

export default PostListItem;
