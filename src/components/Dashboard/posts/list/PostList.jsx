import styles from './PostList.module.css';
import { useState } from 'react';
import usePosts from '../../../../hooks/usePosts';
import PostListItem from './PostListItem';

const PostList = () => {
  const { posts, error, loading, update, setUpdate } = usePosts();

  const [listError, setListError] = useState(null);
  const [listLoading, setListLoading] = useState(null);

  if (loading || listLoading) {
    return <div className={styles.message}>Loading...</div>;
  }

  if (error?.statusCode === 401) {
    return <div className={styles.message}>401 - Unauthorized</div>;
  }

  if (error || listError) {
    return (
      <div className={styles.message}>A network error was encountered</div>
    );
  }

  return (
    <div className={styles.PostList}>
      <div className={styles.header}>
        <h2 className={styles.h2}>Title</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.h2}>Author</h2>
      </div>
      <div className={styles.header}>
        <h2 className={styles.h2}>Published</h2>
      </div>
      <div className={styles.header}></div>
      <div className={styles.header}></div>
      <ul className={styles.ul}>
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            setListError={setListError}
            update={update}
            setUpdate={setUpdate}
            setListLoading={setListLoading}
          />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
