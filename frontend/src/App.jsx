import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';

const NewsRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/blog/${id}`} replace />;
};

const App = () => {
  return (
    <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us-3" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/news" element={<Navigate to="/blog" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/news/:id" element={<NewsRedirect />} />
          <Route path="/blog/:id" element={<PostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
