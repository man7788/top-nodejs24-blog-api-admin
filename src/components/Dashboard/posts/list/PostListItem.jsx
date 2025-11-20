import styles from './PostListItem.module.css';
import { Link } from 'react-router';

const PostListItem = ({ post }) => {
  return (
    <div className={styles.PostListItem}>
      <ul>
        <li>{post.title}</li>
        <Link to={`${post.id}/edit`}>Edit</Link>
      </ul>
    </div>
  );
};

export default PostListItem;
