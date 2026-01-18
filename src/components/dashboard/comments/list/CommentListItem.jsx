import styles from './CommentListItem.module.css';
import { Link } from 'react-router';
import dateFormatter from '../../../../utils/dateFormatter';
import submitCommentDelete from '../../../../api/submitCommentDelete';

const CommentListItem = ({
  comment,
  setListError,
  setListLoading,
  update,
  setUpdate,
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

    setUpdate(!update);
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
      <div className={styles.submitted}>{formattedDate}</div>
      <Link
        className={styles.edit}
        to={`${comment.id}/edit`}
        state={{ postId: comment.postId }}
      >
        Edit
      </Link>
      <form className={styles.form} onSubmit={submitDelete}>
        <input className={styles.delete} type="submit" value="Delete" />
      </form>
    </li>
  );
};

export default CommentListItem;
