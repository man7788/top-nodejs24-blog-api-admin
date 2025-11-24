import styles from './CommentList.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
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
      <h1>Comments</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentListItem
              comment={comment}
              setListError={setListError}
              update={update}
              setUpate={setUpate}
              setListLoading={setListLoading}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
