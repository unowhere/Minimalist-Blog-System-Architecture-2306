import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiTrash2, FiMessageSquare, FiEdit2, FiSend } = FiIcons;

const CommentManagement = () => {
  const { isAuthenticated } = useAuth();
  const { posts, comments, deleteComment, updateComment, addReply } = useBlog();
  const [activePost, setActivePost] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [filteredComments, setFilteredComments] = useState({});

  useEffect(() => {
    if (activePost) {
      setFilteredComments({ [activePost]: comments[activePost] || [] });
    } else {
      setFilteredComments(comments);
    }
  }, [activePost, comments]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleDelete = (postId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(postId, commentId);
    }
  };

  const handleReply = (postId, commentId) => {
    if (!replyContent.trim()) return;
    
    addReply(postId, commentId, {
      content: replyContent,
      name: 'Admin',
      isAdmin: true
    });
    
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleEdit = (postId, commentId) => {
    if (!editContent.trim()) return;
    
    updateComment(postId, commentId, {
      content: editContent
    });
    
    setEditingComment(null);
    setEditContent('');
  };

  const getPostTitle = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post ? post.title : 'Unknown Post';
  };

  const renderComment = (postId, comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-8 mt-4' : 'mb-6'} bg-gray-50 rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h4 className={`font-medium ${comment.isAdmin ? 'text-blue-600' : 'text-gray-900'}`}>
            {comment.name} {comment.isAdmin && <span className="text-xs ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Admin</span>}
          </h4>
          <time className="text-sm text-gray-500 ml-4">
            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
          </time>
        </div>
        
        <div className="flex space-x-2">
          {!isReply && (
            <button
              onClick={() => {
                setReplyingTo(comment.id);
                setReplyContent('');
              }}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
            </button>
          )}
          
          {comment.isAdmin && (
            <button
              onClick={() => {
                setEditingComment(comment.id);
                setEditContent(comment.content);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => handleDelete(postId, comment.id)}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {editingComment === comment.id ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(postId, comment.id)}
              className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setEditingComment(null)}
              className="border border-gray-200 px-3 py-1 rounded hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
      )}
      
      {comment.replies && comment.replies.map(reply => renderComment(postId, reply, true))}
      
      {replyingTo === comment.id && (
        <div className="mt-4 space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => handleReply(postId, comment.id)}
              className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
            >
              <SafeIcon icon={FiSend} className="w-3 h-3" />
              <span>Reply</span>
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="border border-gray-200 px-3 py-1 rounded hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const totalComments = Object.values(comments).reduce(
    (total, postComments) => total + postComments.length, 
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Admin</span>
          </Link>
          <h1 className="text-3xl font-light text-gray-900">Comment Management</h1>
        </div>
        
        <div>
          <select
            value={activePost || ''}
            onChange={(e) => setActivePost(e.target.value || null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">All Posts ({totalComments} comments)</option>
            {Object.keys(comments).map(postId => (
              <option key={postId} value={postId}>
                {getPostTitle(postId)} ({comments[postId].length} comments)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(filteredComments).length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            No comments yet.
          </div>
        ) : (
          Object.entries(filteredComments).map(([postId, postComments]) => (
            <div key={postId} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                <Link to={`/post/${postId}`} className="hover:underline">
                  {getPostTitle(postId)}
                </Link> 
                <span className="text-sm text-gray-500 ml-2">
                  ({postComments.length} comments)
                </span>
              </h2>
              
              {postComments.length === 0 ? (
                <p className="text-gray-500">No comments for this post.</p>
              ) : (
                <div className="space-y-6">
                  {postComments.map(comment => renderComment(postId, comment))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CommentManagement;