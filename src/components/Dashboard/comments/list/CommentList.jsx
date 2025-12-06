import styles from './CommentList.module.css';
import { useState } from 'react';
import useComments from '../../../../hooks/useComments';
import CommentListItem from './CommentListItem';

const CommentList = () => {
  const { comments, error, loading, update, setUpate } = useComments();

  const [listError, setListError] = useState(null);
  const [listLoading, setListLoading] = useState(null);

  if (loading || listLoading) {
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401 || listError?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error || listError) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.CommentList}>
      <div className={styles.header}>
        <h4 className={styles.h4}>Author</h4>
      </div>
      <div className={styles.header}>
        <h4 className={styles.h4}>Comment</h4>
      </div>
      <div className={styles.header}>
        <h4 className={styles.h4}>In reponse to</h4>
      </div>
      <div className={styles.header}>
        <h4 className={styles.h4}>Submmited on</h4>
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
