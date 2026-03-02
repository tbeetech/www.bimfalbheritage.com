import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getPost } from '../services/api';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getPost(id);
      setPost(data);
    };
    load();
  }, [id]);

  if (!post) {
    return <div className="page"><p>Loading...</p></div>;
  }

  const cover = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${import.meta.env.VITE_API_URL || ''}${post.coverImage || ''}`;

  return (
    <div className="page">
      <article className="post-detail card">
        {post.coverImage && <div className="post-hero" style={{ backgroundImage: `url(${cover})` }} />}
        <div className="post-body">
          <div className="pill">{post.category}</div>
          <h1>{post.title}</h1>
          <p className="muted">{dayjs(post.publishDate).format('MMMM DD, YYYY')}</p>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} />
          {post.videoUrl && (
            <div className="video-embed detail">
              <iframe
                src={post.videoUrl.replace('watch?v=', 'embed/')}
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
