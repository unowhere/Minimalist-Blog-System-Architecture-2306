import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import PostEditor from '../components/PostEditor';

const CreatePost = () => {
  const { isAuthenticated } = useAuth();
  const { createPost } = useBlog();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = (postData) => {
    const postId = createPost(postData);
    navigate('/admin');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PostEditor
        title="Create New Post"
        onSave={handleSave}
        onCancel={() => navigate('/admin')}
      />
    </motion.div>
  );
};

export default CreatePost;