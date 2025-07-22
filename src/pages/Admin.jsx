import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit3, FiTrash2, FiTag, FiMessageSquare, FiBookmark } = FiIcons;

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const { posts, deletePost, updatePost } = useBlog();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  const togglePinned = (post) => {
    updatePost(post.id, { isPinned: !post.isPinned });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/comments"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
            <span>Manage Comments</span>
          </Link>
          <Link
            to="/admin/tags"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiTag} className="w-4 h-4" />
            <span>Manage Tags</span>
          </Link>
          <Link
            to="/admin/create"
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {sortedPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No posts yet. Create your first post to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedPosts.map((post) => (
              <div key={post.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
                    {post.isPinned && (
                      <SafeIcon icon={FiBookmark} className="w-4 h-4 mr-2 text-amber-600" />
                    )}
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePinned(post)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.isPinned 
                        ? 'text-amber-600 hover:bg-amber-50' 
                        : 'text-gray-400 hover:text-amber-600 hover:bg-gray-100'
                    }`}
                    title={post.isPinned ? "Unpin post" : "Pin post"}
                  >
                    <SafeIcon icon={FiBookmark} className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/admin/edit/${post.id}`}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Admin;