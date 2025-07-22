import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import TagDisplay from '../components/TagDisplay';
import CommentSection from '../components/CommentSection';
import ContentRenderer from '../components/ContentRenderer';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit3 } = FiIcons;

const Post = () => {
  const { id } = useParams();
  const { posts } = useBlog();
  
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-light text-gray-900 mb-4">Post not found</h1>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to all posts</span>
        </Link>
        
        <Link
          to={`/admin/edit/${post.id}`}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
          <span>Edit post</span>
        </Link>
      </div>

      <header className="space-y-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>•</span>
              <TagDisplay tags={post.tags} />
            </>
          )}
        </div>
        
        <h1 className="text-5xl font-light text-gray-900 leading-tight">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {post.excerpt}
          </p>
        )}
      </header>

      <div className="py-8">
        <ContentRenderer content={post.content} />
      </div>

      <CommentSection postId={post.id} />
    </motion.article>
  );
};

export default Post;