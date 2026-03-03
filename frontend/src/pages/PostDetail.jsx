import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  addComment,
  deletePost,
  getComments,
  getPost,
  getSessionStatus,
  reactToComment,
  reactToPost,
} from '../services/api';
import './PostDetail.css';

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
  if (url.includes('vimeo.com/')) return `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
  return url;
};

const buildCommentTree = (comments) => {
  const byId = new Map();
  comments.forEach((comment) => byId.set(comment.id, { ...comment, replies: [] }));
  const root = [];
  byId.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId).replies.push(comment);
    } else {
      root.push(comment);
    }
  });
  return root;
};

const CommentNode = ({ comment, postId, onReact, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  return (
    <div className="comment-node">
      <div className="comment-head">
        <strong>{comment.author}</strong>
        <span>{dayjs(comment.createdAt).format('MMM D, YYYY h:mm A')}</span>
      </div>
      <p>{comment.text}</p>
      <div className="comment-actions">
        <button type="button" onClick={() => onReact(postId, comment.id, 'up')}>Upvote {comment.upvotes || 0}</button>
        <button type="button" onClick={() => onReact(postId, comment.id, 'down')}>Downvote {comment.downvotes || 0}</button>
        <button type="button" onClick={() => setShowReply((prev) => !prev)}>Reply</button>
      </div>

      {showReply && (
        <form
          className="reply-form"
          onSubmit={(event) => {
            event.preventDefault();
            onReply(postId, comment.id, replyAuthor, replyText);
            setReplyText('');
          }}
        >
          <input value={replyAuthor} onChange={(event) => setReplyAuthor(event.target.value)} placeholder="Name" />
          <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Reply..." rows={2} />
          <button type="submit">Post Reply</button>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postId={postId}
              onReact={onReact}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [copyState, setCopyState] = useState('');
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const loadPost = async () => {
    const data = await getPost(id);
    setPost(data);
  };

  const loadComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data);
    } catch {
      setComments(post?.comments || []);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadPost();
    };
    load();
  }, [id]);

  useEffect(() => {
    if (id) loadComments();
  }, [id]);

  useEffect(() => {
    getSessionStatus().then((res) => setIsAdmin(res.admin)).catch(() => setIsAdmin(false));
  }, []);

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

  const handlePostReaction = async (type) => {
    if (!post) return;
    try {
      const next = await reactToPost(post._id || post.id, type);
      setPost((prev) => ({ ...prev, ...next }));
    } catch {
      setPost((prev) => ({
        ...prev,
        upvotes: type === 'up' ? (prev.upvotes || 0) + 1 : prev.upvotes || 0,
        downvotes: type === 'down' ? (prev.downvotes || 0) + 1 : prev.downvotes || 0,
      }));
    }
  };

  const handleCommentReaction = async (postId, commentId, type) => {
    try {
      await reactToComment(postId, commentId, type);
      await loadComments();
    } catch {
      setComments((prev) => prev.map((comment) => {
        if (comment.id !== commentId) return comment;
        return {
          ...comment,
          upvotes: type === 'up' ? (comment.upvotes || 0) + 1 : comment.upvotes || 0,
          downvotes: type === 'down' ? (comment.downvotes || 0) + 1 : comment.downvotes || 0,
        };
      }));
    }
  };

  const handleAddComment = async (postId, parentId, nextAuthor, nextText) => {
    if (!nextText.trim()) return;
    try {
      await addComment(postId, { author: nextAuthor || 'Guest', text: nextText, parentId });
      await loadComments();
    } catch {
      setComments((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          parentId: parentId || null,
          author: nextAuthor || 'Guest',
          text: nextText,
          createdAt: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
        },
      ]);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deletePost(post._id || post.id);
      navigate('/blog');
    } catch {
      alert('Failed to delete post.');
    }
  };

  if (!post) {
    return <div className="page"><p>Loading...</p></div>;
  }

  const cover = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${import.meta.env.VITE_API_URL || ''}${post.coverImage || ''}`;

  const postImages = Array.isArray(post.images) && post.images.length > 0
    ? post.images
    : (post.coverImage ? [post.coverImage] : []);

  const resolveImageUrl = (img) =>
    img?.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || ''}${img || ''}`;

  const sharePlatforms = post.sharePlatforms || '';
  const platformList = Array.isArray(sharePlatforms)
    ? sharePlatforms
    : sharePlatforms.split(',').map((s) => s.trim()).filter(Boolean);

  const commentTree = buildCommentTree(comments);

  return (
    <div className="page">
      <article className="post-detail card">
        {postImages.length > 0 && (
          <div className={`post-images-gallery${postImages.length === 1 ? ' single' : ''}`}>
            {postImages.map((img, i) => (
              <img
                key={i}
                src={resolveImageUrl(img)}
                alt={i === 0 ? post.title : `Image ${i + 1}`}
                className="post-gallery-img"
              />
            ))}
          </div>
        )}
        <div className="post-body">
          <h1>{post.title}</h1>
          <p className="post-meta">
            {dayjs(post.publishDate).format('MMMM DD, YYYY')} | {post.category || 'General'} | Type: {post.contentType || 'blog'}
            {post.authorName ? ` | By ${post.authorName}` : ''}
          </p>

          {isAdmin && (
            <div className="admin-actions">
              <a className="btn secondary" href={`/admin/edit/${post._id || post.id}`}>Edit post</a>
              <button type="button" className="btn danger" onClick={handleDeletePost}>Delete post</button>
            </div>
          )}

          <div className="post-vote">
            <button type="button" onClick={() => handlePostReaction('up')}>Upvote {post.upvotes || 0}</button>
            <button type="button" onClick={() => handlePostReaction('down')}>Downvote {post.downvotes || 0}</button>
            <span>Score {(post.upvotes || 0) - (post.downvotes || 0)}</span>
          </div>

          {(post.collaborationPartner || post.collaborationType) && (
            <div className="cooperation-box">
              <strong>Cooperation</strong>
              <p>
                {post.collaborationPartner || 'Partner not specified'}
                {post.collaborationType ? ` (${post.collaborationType})` : ''}
              </p>
            </div>
          )}

          {post.contentType === 'event' && (
            <div className="event-box">
              <h3>{post.eventMeta?.title || post.title}</h3>
              <p>{post.eventMeta?.location}</p>
              {post.eventMeta?.startDate && (
                <p>
                  {dayjs(post.eventMeta.startDate).format('MMM D, YYYY h:mm A')}
                  {post.eventMeta?.endDate ? ` - ${dayjs(post.eventMeta.endDate).format('MMM D, YYYY h:mm A')}` : ''}
                </p>
              )}
              {post.eventMeta?.externalUrl && (
                <a href={post.eventMeta.externalUrl} target="_blank" rel="noreferrer">
                  Open {post.eventMeta?.platform || 'Event link'}
                </a>
              )}
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

          <section className="comments-panel">
            <h2>Interactive Responses</h2>
            <form
              className="comment-form"
              onSubmit={async (event) => {
                event.preventDefault();
                await handleAddComment(post._id || post.id, null, author, commentText);
                setCommentText('');
              }}
            >
              <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Name (optional)" />
              <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add your response..." rows={3} required />
              <button type="submit">Post Response</button>
            </form>

            <div className="comment-list">
              {commentTree.length === 0 && <p className="muted">No responses yet.</p>}
              {commentTree.map((comment) => (
                <CommentNode
                  key={comment.id}
                  comment={comment}
                  postId={post._id || post.id}
                  onReact={handleCommentReaction}
                  onReply={handleAddComment}
                />
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
