import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import './ArticleCard.css';

const ArticleCard = ({ post }) => {
  const cover = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${import.meta.env.VITE_API_URL || ''}${post.coverImage || ''}`;

  return (
    <article className="article-card card">
      {post.coverImage && <div className="article-cover" style={{ backgroundImage: `url(${cover})` }} />}
      <div className="article-body">
        <span className="tag">{post.category}</span>
        <h3>{post.title}</h3>
        <p className="muted">{dayjs(post.publishDate).format('MMM DD, YYYY')}</p>
        <p className="muted preview" dangerouslySetInnerHTML={{ __html: post.body?.slice(0, 160) + '...' }} />
        <Link className="read-more" to={`/blog/${post._id || post.id}`}>Read story →</Link>
      </div>
    </article>
  );
};

export default ArticleCard;
