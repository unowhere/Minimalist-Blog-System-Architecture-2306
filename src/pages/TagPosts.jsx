import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import TagDisplay from '../components/TagDisplay';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft } = FiIcons;

const TagPosts = () => {
  const { id } = useParams();
  const { getPostsByTag, getTag } = useBlog();
  
  const tag = getTag(id);
  const posts = getPostsByTag(id);
  
  if (!tag) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-light text-gray-900 mb-4">Tag not found</h1>
        <Link
          to="/tags"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to tags</span>
        </Link>
      </div>
    );
  }
  
  // Sort posts by date
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/tags"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>All Tags</span>
        </Link>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl font-light text-gray-900">
          Articles tagged with "{tag.name}"
        </h1>
        <p className="text-gray-600">
          {sortedPosts.length} article{sortedPosts.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="space-y-12">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No articles found with this tag.</p>
          </div>
        ) : (
          sortedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <time dateTime={post.createdAt}>
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <TagDisplay tags={post.tags} />
                  )}
                </div>
                
                <Link
                  to={`/post/${post.id}`}
                  className="block space-y-3 group-hover:opacity-70 transition-opacity"
                >
                  <h2 className="text-2xl font-light text-gray-900 leading-tight">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TagPosts;