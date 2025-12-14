import styles from './CommentList.module.css';
import { useState } from 'react';
import useComments from '../../../../hooks/useComments';
import CommentListItem from './CommentListItem';

const CommentList = () => {
  const { comments, error, loading, update, setUpate } = useComments();

  const [listError, setListError] = useState(null);
  const [listLoading, setListLoading] = useState(null);

  if (loading || listLoading) {
    return <div className={styles.altMessage}>loading...</div>;
  }

  if (error?.statusCode === 401 || listError?.statusCode === 401) {
    return <div className={styles.altMessage}>401 - Unauthorized</div>;
  }

  if (error || listError) {
    return (
      <div className={styles.altMessage}>A network error was encountered</div>
    );
  }

  return (
    <div className={styles.CommentList}>
      <div className={styles.header}>
        <h2 className={styles.h2}>Author</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.h2}>Comment</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.h2}>In reponse to</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.h2}>Submmited on</h2>
      </div>
      <div className={styles.header}></div>
      <div className={styles.header}></div>
      <ul className={styles.ul}>
        {comments.map((comment) => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            setListError={setListError}
            update={update}
            setUpate={setUpate}
            setListLoading={setListLoading}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
