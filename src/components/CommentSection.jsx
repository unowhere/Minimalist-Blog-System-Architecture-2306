import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiTrash2, FiEdit2, FiSend, FiX } = FiIcons;

const CommentSection = ({ postId }) => {
  const { addComment, getPostComments, deleteComment, updateComment, addReply } = useBlog();
  const { isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const comments = getPostComments(postId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.content.trim()) {
      alert('Name and comment are required');
      return;
    }
    addComment(postId, newComment);
    setNewComment({ name: '', email: '', content: '' });
  };

  const handleReply = (commentId) => {
    if (!replyContent.trim()) return;
    
    addReply(postId, commentId, {
      content: replyContent,
      name: 'Admin',
      isAdmin: true
    });
    
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleEdit = (commentId) => {
    if (!editContent.trim()) return;
    
    updateComment(postId, commentId, {
      content: editContent
    });
    
    setEditingComment(null);
    setEditContent('');
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(postId, commentId);
    }
  };

  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const renderComment = (comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isReply ? 'ml-8 mt-4' : 'mb-6'} bg-gray-50 rounded-lg p-6`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h4 className={`font-medium ${comment.isAdmin ? 'text-blue-600' : 'text-gray-900'}`}>
            {comment.name} {comment.isAdmin && <span className="text-xs ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Admin</span>}
          </h4>
          <time className="text-sm text-gray-500 ml-4">
            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
          </time>
        </div>
        
        {isAuthenticated && (
          <div className="flex space-x-2">
            {!isReply && (
              <button
                onClick={() => startReply(comment.id)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
              </button>
            )}
            
            {comment.isAdmin && (
              <button
                onClick={() => startEdit(comment)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SafeIcon icon={FiEdit2} className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => handleDelete(comment.id)}
              className="p-1 text-red-500 hover:text-red-700 transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        )}
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
              onClick={() => handleEdit(comment.id)}
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
      
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      
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
              onClick={() => handleReply(comment.id)}
              className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
            >
              <SafeIcon icon={FiSend} className="w-3 h-3" />
              <span>Reply</span>
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="flex items-center space-x-1 border border-gray-200 px-3 py-1 rounded hover:bg-gray-100 transition-colors text-sm"
            >
              <SafeIcon icon={FiX} className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8 pt-8 border-t border-gray-100">
      <h3 className="text-2xl font-light text-gray-900">
        Comments ({comments.length})
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Share your thoughts..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Post Comment
        </button>
      </form>
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;