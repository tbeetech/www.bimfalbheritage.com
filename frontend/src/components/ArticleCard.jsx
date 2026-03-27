import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { resolveImageUrl } from '../utils/imageUrl';
import './ArticleCard.css';

const toPreview = (html = '') =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);

const ArticleCard = ({ post }) => {
  const cover = resolveImageUrl(post.coverImage);

  return (
    <article className="article-card card">
      {post.coverImage && <div className="article-cover" style={{ backgroundImage: `url(${cover})` }} />}
      <div className="article-body">
        <span className="tag">{post.contentType || post.category || 'General'}</span>
        <h3>{post.title}</h3>
        <p className="muted">{dayjs(post.publishDate).format('MMM DD, YYYY')}</p>
        {typeof post.upvotes === 'number' && typeof post.downvotes === 'number' && (
          <p className="meta-inline article-meta-stats">
            <span>▲ {post.upvotes - post.downvotes}</span>
            {typeof post.views === 'number' && <span>👁 {post.views}</span>}
            {Array.isArray(post.likes) && <span>❤️ {post.likes.length}</span>}
          </p>
        )}
        {post.collaborationPartner && (
          <p className="meta-inline">In cooperation with {post.collaborationPartner}</p>
        )}
        <p className="muted preview">
          {post.excerpt || `${toPreview(post.body)}...`}
        </p>
        <Link className="read-more" to={`/blog/${post._id || post.id}`}>Continue Reading</Link>
      </div>
    </article>
  );
};

export default ArticleCard;
