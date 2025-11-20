import styles from './PostList.module.css';
import usePosts from '../../../../hooks/usePosts';
import PostListItem from './PostListItem';

const PostList = () => {
  const { posts, error, loading } = usePosts();

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (error?.statusCode === 401) {
    return <h1>401 - Unauthorized</h1>;
  }

  if (error) {
    return <h1>A network error was encountered</h1>;
  }

  return (
    <div className={styles.PostList}>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostListItem post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
