import styles from './PostListItem.module.css';
import { Link } from 'react-router';
import dateFormatter from '../../../../utils/dateFormatter';
import submitPostDelete from '../../../../api/submitPostDelete';

const PostListItem = ({
  post,
  setListError,
  setListLoading,
  update,
  setUpdate,
}) => {
  const formattedDate = dateFormatter(post.createdAt);

  const submitDelete = async (e) => {
    e.preventDefault();

    setListLoading(true);

    const result = await submitPostDelete(post.id);

    if (result.error) {
      setListError(true);
      setListLoading(false);
      return;
    }

    setUpdate(!update);
    setListLoading(false);
  };

  return (
    <li className={styles.PostListItem}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.author}>{post.author.name}</div>
      <div className={styles.published}>{formattedDate}</div>
      <Link className={styles.edit} to={`${post.id}/edit`}>
        Edit
      </Link>
      <form className={styles.form} onSubmit={submitDelete}>
        <input className={styles.delete} type="submit" value="Delete" />
      </form>
    </li>
  );
};

export default PostListItem;
