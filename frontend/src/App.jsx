import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import AdminCreate from './pages/AdminCreate';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us-3" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/news" element={<Blog />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/news/:id" element={<PostDetail />} />
          <Route path="/blog/:id" element={<PostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/admin" element={<AdminCreate />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
