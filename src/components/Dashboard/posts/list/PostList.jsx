import styles from './PostList.module.css';
import { useState } from 'react';
import usePosts from '../../../../hooks/usePosts';
import PostListItem from './PostListItem';

const PostList = () => {
  const { posts, error, loading, update, setUpate } = usePosts();

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
    <div className={styles.PostList}>
      <div className={styles.header}>
        <h4 className={styles.h4}>Title</h4>
      </div>
      <div className={styles.header}>
        <h4 className={styles.h4}>Author</h4>
      </div>
      <div className={styles.header}>
        <h4 className={styles.h4}>Published</h4>
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
            setUpate={setUpate}
            setListLoading={setListLoading}
          />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
