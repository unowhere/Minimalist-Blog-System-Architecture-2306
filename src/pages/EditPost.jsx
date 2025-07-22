import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import PostEditor from '../components/PostEditor';

const EditPost = () => {
  const { isAuthenticated } = useAuth();
  const { posts, updatePost } = useBlog();
  const navigate = useNavigate();
  const { id } = useParams();

  const post = posts.find(p => p.id === id);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-light text-gray-900">Post not found</h1>
      </div>
    );
  }

  const handleSave = (postData) => {
    updatePost(id, postData);
    navigate('/admin');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PostEditor
        title="Edit Post"
        initialData={post}
        onSave={handleSave}
        onCancel={() => navigate('/admin')}
      />
    </motion.div>
  );
};

export default EditPost;