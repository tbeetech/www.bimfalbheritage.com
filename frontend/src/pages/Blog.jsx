import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { getPosts } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import './Blog.css';

const feedTabs = [
  { label: 'All', value: '' },
  { label: 'Blog', value: 'blog' },
  { label: 'Vlog', value: 'vlog' },
  { label: 'News', value: 'news' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Events', value: 'event' },
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState();
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Blog & News',
    description:
      'Explore articles, vlogs, news, and events covering Nigerian festivals, cultural heritage, and African traditions from the Bimfalb Heritage editorial team.',
    url: 'https://www.bimfalbheritage.org/blog',
    keywords: 'Nigerian festivals blog, African culture news, Bimfalb Heritage blog, heritage events',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Bimfalb Heritage Blog & News',
      url: 'https://www.bimfalbheritage.org/blog',
      publisher: {
        '@type': 'NGO',
        name: 'Bimfalb Heritage',
        url: 'https://www.bimfalbheritage.org',
        logo: 'https://www.bimfalbheritage.org/logo.jpg',
      },
      inLanguage: 'en-NG',
    },
  });

  const load = async (page = 1, contentType = activeTab) => {
    setLoading(true);
    try {
      const res = await getPosts(page, 6, contentType);
      setPosts(res.data || []);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, activeTab);
  }, [activeTab]);

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
      <div className="feed-tabs">
        {feedTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={tab.value === activeTab ? 'active' : ''}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner message="Loading posts…" />
      ) : posts.length === 0 ? (
        <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>No posts found.</p>
      ) : (
        <>
          <div className="grid blog-grid">
            {posts.map((post) => (
              <ArticleCard key={post._id || post.id} post={post} />
            ))}
          </div>
          <Pagination pagination={pagination} onChange={(page) => load(page, activeTab)} />
        </>
      )}
    </div>
  );
};

export default Blog;
