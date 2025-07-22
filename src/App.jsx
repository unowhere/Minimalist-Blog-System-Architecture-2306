import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticlesList from './pages/ArticlesList';
import TagsPage from './pages/TagsPage';
import TagPosts from './pages/TagPosts';
import Post from './pages/Post';
import Admin from './pages/Admin';
import CommentManagement from './pages/CommentManagement';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import TagManagement from './pages/TagManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/tag/:id" element={<TagPosts />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/create" element={<CreatePost />} />
              <Route path="/admin/edit/:id" element={<EditPost />} />
              <Route path="/admin/tags" element={<TagManagement />} />
              <Route path="/admin/comments" element={<CommentManagement />} />
            </Routes>
          </Layout>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;