import styles from './CommentListItem.module.css';
import { Link } from 'react-router';
import submitCommentDelete from '../../../../api/submitCommentDelete';

const CommentListItem = ({
  comment,
  setListError,
  setListLoading,
  update,
  setUpate,
}) => {
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
    <div className={styles.PostListItem}>
      <ul>
        <li>{comment.name}</li>
        <li>{comment.email}</li>
        <li>{comment.content}</li>
        <li>{comment.post.title}</li>
        <Link to={`${comment.id}/edit`} state={{ postId: comment.postId }}>
          Edit
        </Link>
        <form onSubmit={submitDelete}>
          <input type="submit" value="Delete" />
        </form>
      </ul>
    </div>
  );
};

export default CommentListItem;
