import { Routes, Route } from 'react-router-dom';
import AdminDashboardPane from './admin/AdminDashboardPane';
import AdminPostsPane from './admin/AdminPostsPane';
import AdminEditorPane from './admin/AdminEditorPane';

const Admin = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboardPane />} />
      <Route path="posts" element={<AdminPostsPane />} />
      <Route path="edit/:id" element={<AdminEditorPane />} />
    </Routes>
  );
};

export default Admin;
