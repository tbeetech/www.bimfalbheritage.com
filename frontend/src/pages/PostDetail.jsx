import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getPost } from '../services/api';
import './PostDetail.css';

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
  if (url.includes('vimeo.com/')) return `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
  return url;
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [copyState, setCopyState] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getPost(id);
      setPost(data);
    };
    load();
  }, [id]);

  const shareLinks = useMemo(() => {
    if (!post || typeof window === 'undefined') return null;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    return {
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      x: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=${url}`,
    };
  }, [post]);

  if (!post) {
    return <div className="page"><p>Loading...</p></div>;
  }

  const cover = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${import.meta.env.VITE_API_URL || ''}${post.coverImage || ''}`;

  const sharePlatforms = post.sharePlatforms || '';
  const platformList = Array.isArray(sharePlatforms)
    ? sharePlatforms
    : sharePlatforms.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="page">
      <article className="post-detail card">
        {post.coverImage && <div className="post-hero" style={{ backgroundImage: `url(${cover})` }} />}
        <div className="post-body">
          <h1>{post.title}</h1>
          <p className="post-meta">
            {dayjs(post.publishDate).format('MMMM DD, YYYY')} | {post.category || 'General'}
            {post.authorName ? ` | By ${post.authorName}` : ''}
          </p>

          {(post.collaborationPartner || post.collaborationType) && (
            <div className="cooperation-box">
              <strong>Cooperation</strong>
              <p>
                {post.collaborationPartner || 'Partner not specified'}
                {post.collaborationType ? ` (${post.collaborationType})` : ''}
              </p>
            </div>
          )}

          {platformList.length > 0 && (
            <p className="meta-platforms">Cross platform publication: {platformList.join(', ')}</p>
          )}

          <div className="share-strip">
            <strong>Share:</strong>
            {shareLinks && (
              <>
                <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={shareLinks.x} target="_blank" rel="noreferrer">X</a>
                <a href={shareLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>
                <a href={shareLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={shareLinks.email}>Email</a>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopyState('Link copied');
                    setTimeout(() => setCopyState(''), 1200);
                  }}
                >
                  Copy link
                </button>
              </>
            )}
            {copyState && <span>{copyState}</span>}
          </div>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} />

          {post.videoUrl && (
            <div className="video-embed detail">
              <iframe
                src={toEmbedUrl(post.videoUrl)}
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
