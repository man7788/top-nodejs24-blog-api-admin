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
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostListItem
              post={post}
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

export default PostList;
