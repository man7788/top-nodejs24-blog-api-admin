import styles from './CommentListItem.module.css';
import { Link } from 'react-router';
import dateFormatter from '../../../../utils/dateFormatter';
import submitCommentDelete from '../../../../api/submitCommentDelete';

const CommentListItem = ({
  comment,
  setListError,
  setListLoading,
  update,
  setUpate,
}) => {
  const formattedDate = dateFormatter(comment.createdAt);

  const submitDelete = async (e) => {
    e.preventDefault();

    setListLoading(true);

    const result = submitCommentDelete(comment.postId, comment.id);

    if (result.error) {
      setListError(true);
      setListLoading(false);
      return;
    }

    setUpate(!update);
    setListLoading(false);
  };

  return (
    <li className={styles.CommentListItem}>
      <div className={styles.author}>
        <p className={styles.p}>{comment.name}</p>
        <p className={styles.p}>{comment.email}</p>
      </div>
      <div className={styles.comment}>
        <p className={styles.p}>{comment.content}</p>
      </div>
      <div className={styles.post}>
        <p className={styles.p}>{comment.post.title}</p>
      </div>
      <div className={styles.submmited}>{formattedDate}</div>
      <Link
        className={styles.link}
        to={`${comment.id}/edit`}
        state={{ postId: comment.postId }}
      >
        Edit
      </Link>
      <form className={styles.form} onSubmit={submitDelete}>
        <input type="submit" value="Delete" />
      </form>
    </li>
  );
};

export default CommentListItem;
