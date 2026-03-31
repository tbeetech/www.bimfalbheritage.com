import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  addComment,
  deleteComment,
  getComments,
  getPost,
  likePost,
  reactToComment,
  reactToPost,
  sharePost,
  trackView,
} from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import Spinner from '../components/Spinner';
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

const CommentNode = ({ comment, postId, onReact, onReply, onDelete, currentUserId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const canDelete = currentUserId && (currentUserId === comment.userId);

  return (
    <div className="comment-node">
      <div className="comment-head">
        <span className="comment-avatar">
          {comment.author?.trim() ? comment.author.trim()[0].toUpperCase() : '?'}
        </span>
        <strong>{comment.author}</strong>
        <span>{dayjs(comment.createdAt).format('MMM D, YYYY h:mm A')}</span>
        {canDelete && (
          <button type="button" className="comment-delete-btn" onClick={() => onDelete(postId, comment.id)} aria-label="Delete comment">
            ✕
          </button>
        )}
      </div>
      <p>{comment.text}</p>
      <div className="comment-actions">
        <button type="button" onClick={() => onReact(postId, comment.id, 'up')}>
          ▲ {comment.upvotes || 0}
        </button>
        <button type="button" onClick={() => onReact(postId, comment.id, 'down')}>
          ▼ {comment.downvotes || 0}
        </button>
        <button type="button" onClick={() => setShowReply((prev) => !prev)}>
          {showReply ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {showReply && (
        <form
          className="reply-form"
          onSubmit={(event) => {
            event.preventDefault();
            onReply(postId, comment.id, replyText);
            setReplyText('');
            setShowReply(false);
          }}
        >
          <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Write a reply…" rows={2} required />
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
              onDelete={onDelete}
              currentUserId={currentUserId}
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
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [copyState, setCopyState] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const loadPost = async () => {
    const data = await getPost(id);
    setPost(data);
    if (data) {
      setLikeCount(Array.isArray(data.likes) ? data.likes.length : (data.likes || 0));
      if (user && Array.isArray(data.likes)) {
        setLiked(data.likes.includes(user.id));
      }
    }
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

  // Track view once per post load
  useEffect(() => {
    if (id) trackView(id);
  }, [id]);

  useEffect(() => {
    if (id) loadComments();
  }, [id]);

  const postSlug = post?._id || post?.id || id;
  const postUrl = `https://www.bimfalbheritage.org/blog/${postSlug}`;
  const postImage = post?.coverImage || post?.images?.[0] || undefined;

  useSEO({
    title: post?.title,
    description: post?.excerpt,
    image: postImage,
    url: post ? postUrl : undefined,
    type: 'article',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': post.contentType === 'news' ? 'NewsArticle' : 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: postImage ? [postImage] : undefined,
          datePublished: post.publishDate || post.createdAt,
          dateModified: post.updatedAt || post.publishDate || post.createdAt,
          author: {
            '@type': 'Person',
            name: post.authorName || 'Bimfalb Heritage Editorial',
          },
          publisher: {
            '@type': 'NGO',
            name: 'Bimfalb Heritage',
            url: 'https://www.bimfalbheritage.org',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.bimfalbheritage.org/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
          },
          keywords: post.tags,
        }
      : undefined,
  });

  const shareLinks = useMemo(() => {
    if (!post || typeof window === 'undefined') return null;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);    return {
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

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const result = await likePost(post._id || post.id);
      setLiked(result.liked);
      setLikeCount(result.likes);
    } catch {
      // optimistic – use functional updater to avoid stale closure
      setLiked((prev) => {
        const nowLiked = !prev;
        setLikeCount((c) => nowLiked ? c + 1 : c - 1);
        return nowLiked;
      });
    }
  };

  const handleShare = async (platform) => {
    if (post) sharePost(post._id || post.id);
    if (platform === 'copy') {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('Link copied');
      setTimeout(() => setCopyState(''), 1200);
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

  const handleAddComment = async (postId, parentId, nextText) => {
    if (!nextText.trim()) return;
    // Use authenticated user name, fallback to prompt
    const authorName = user ? user.name : 'Guest';
    try {
      await addComment(postId, { author: authorName, text: nextText, parentId });
      await loadComments();
    } catch {
      setComments((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          parentId: parentId || null,
          userId: user?.id || null,
          author: authorName,
          text: nextText,
          createdAt: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
        },
      ]);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // ignore
    }
  };

  if (!post) {
    return <div className="page"><Spinner message="Loading post…" /></div>;
  }

  const cover = resolveImageUrl(post.coverImage);

  const postImages = Array.isArray(post.images) && post.images.length > 0
    ? post.images
    : (post.coverImage ? [post.coverImage] : []);

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

          {/* ── Stats bar ── */}
          <div className="post-stats-bar">
            <span className="post-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {post.views || 0} views
            </span>
            <span className="post-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {likeCount} likes
            </span>
            <span className="post-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              {post.shares || 0} shares
            </span>
            <span className="post-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {comments.length} comments
            </span>
          </div>

          <div className="post-vote">
            <button type="button" onClick={() => handlePostReaction('up')}>▲ {post.upvotes || 0}</button>
            <button type="button" onClick={() => handlePostReaction('down')}>▼ {post.downvotes || 0}</button>
            <span>Score {(post.upvotes || 0) - (post.downvotes || 0)}</span>
            <button
              type="button"
              className={`like-btn${liked ? ' liked' : ''}`}
              onClick={handleLike}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''} Like
            </button>
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
                <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" onClick={() => handleShare('whatsapp')}>WhatsApp</a>
                <a href={shareLinks.x} target="_blank" rel="noreferrer" onClick={() => handleShare('x')}>X</a>
                <a href={shareLinks.facebook} target="_blank" rel="noreferrer" onClick={() => handleShare('facebook')}>Facebook</a>
                <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" onClick={() => handleShare('linkedin')}>LinkedIn</a>
                <a href={shareLinks.email} onClick={() => handleShare('email')}>Email</a>
                <button
                  type="button"
                  onClick={() => handleShare('copy')}
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
            <h2>Interactive Responses ({comments.length})</h2>

            {/* Comment form */}
            {user ? (
              <form
                className="comment-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await handleAddComment(post._id || post.id, null, commentText);
                  setCommentText('');
                }}
              >
                <div className="comment-user-badge">
                  <span className="comment-user-avatar">{user.name?.trim() ? user.name.trim()[0].toUpperCase() : '?'}</span>
                  <span>Commenting as <strong>{user.name}</strong></span>
                </div>
                <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Share your thoughts…" rows={3} required />
                <button type="submit">Post Response</button>
              </form>
            ) : (
              <div className="comment-login-prompt">
                <p>
                  <a href="/login">Sign in</a> or <a href="/register">create an account</a> to leave a comment and join the conversation.
                </p>
                <form
                  className="comment-form"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await handleAddComment(post._id || post.id, null, commentText);
                    setCommentText('');
                  }}
                >
                  <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add your response as Guest…" rows={3} required />
                  <button type="submit">Post as Guest</button>
                </form>
              </div>
            )}

            <div className="comment-list">
              {commentTree.length === 0 && <p className="muted">No responses yet. Be the first to comment!</p>}
              {commentTree.map((comment) => (
                <CommentNode
                  key={comment.id}
                  comment={comment}
                  postId={post._id || post.id}
                  onReact={handleCommentReaction}
                  onReply={(postId, parentId, text) => handleAddComment(postId, parentId, text)}
                  onDelete={handleDeleteComment}
                  currentUserId={user?.id}
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
