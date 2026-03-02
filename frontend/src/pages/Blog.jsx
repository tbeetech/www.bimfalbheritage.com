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
      <header className="page-header">
        <h1>Blog</h1>
        <p>News and stories from Bimfalb Heritage programs and collaborators.</p>
      </header>

      <div className="blog-intro card">
        <p>
          This upgraded news hub includes editorial collaboration metadata and direct
          multi-platform sharing so each story can travel across partner channels.
        </p>
      </div>

      <div className="grid blog-grid">
        {posts.map((post) => (
          <ArticleCard key={post._id || post.id} post={post} />
        ))}
      </div>

      <Pagination pagination={pagination} onChange={load} />
    </div>
  );
};

export default Blog;
