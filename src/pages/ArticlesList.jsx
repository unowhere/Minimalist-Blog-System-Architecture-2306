import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiX } = FiIcons;

const ArticlesList = () => {
  const { posts } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Sort posts by date (chronological order)
  useEffect(() => {
    const sortedPosts = [...posts].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (searchTerm.trim() === '') {
      setFilteredPosts(sortedPosts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = sortedPosts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        (post.excerpt && post.excerpt.toLowerCase().includes(term))
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-gray-900">All Articles</h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-64 px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SafeIcon icon={FiSearch} className="w-4 h-4" />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-500">
          Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} matching "{searchTerm}"
        </p>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No matching articles found.' : 'No articles yet.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredPosts.map((post, index) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-2"
              >
                <Link 
                  to={`/post/${post.id}`} 
                  className="flex items-center justify-between px-6 py-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{post.title}</span>
                  <time className="text-sm text-gray-500">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </time>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;