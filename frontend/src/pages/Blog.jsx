import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { getPosts } from '../services/api';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState();

  const load = async (page = 1) => {
    const res = await getPosts(page, 6);
    setPosts(res.data || []);
    setPagination(res.pagination);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="blog-header">
        <div>
          <div className="pill">Journal</div>
          <h1>Bimfalb stories & field notes</h1>
          <p className="muted">Documenting history, craft, festivals, and the everyday beauty of Bimfalb communities.</p>
        </div>
      </div>

      <div className="grid featured-grid">
        {posts.map((post) => (
          <ArticleCard key={post._id || post.id} post={post} />
        ))}
      </div>

      <Pagination pagination={pagination} onChange={load} />
    </div>
  );
};

export default Blog;
