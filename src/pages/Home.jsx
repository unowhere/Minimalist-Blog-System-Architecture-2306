import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import TagTree from '../components/TagTree';
import TagDisplay from '../components/TagDisplay';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBookmark, FiArrowRight } = FiIcons;

const Home = () => {
  const { posts, getTagHierarchy, getTagPostCount } = useBlog();

  // Sort posts: pinned first, then by date
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Get featured (most recent) posts
  const featuredPosts = sortedPosts.slice(0, 5);

  // Get tag hierarchy and post counts
  const tagHierarchy = getTagHierarchy();
  const tagPostCounts = getTagPostCount();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide">
            Thoughts & Ideas
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            A minimal space for sharing thoughts, ideas, and insights.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="space-y-12">
          <h2 className="text-2xl font-light text-gray-900">Featured Posts</h2>
          {featuredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No posts yet. Check back soon.</p>
            </div>
          ) : (
            featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <time dateTime={post.createdAt}>
                        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                      </time>
                      {post.isPinned && (
                        <div className="flex items-center text-amber-600">
                          <SafeIcon icon={FiBookmark} className="w-4 h-4 mr-1" />
                          <span>Pinned</span>
                        </div>
                      )}
                    </div>
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
          {posts.length > 5 && (
            <div className="text-center">
              <Link
                to="/articles"
                className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>View All Articles</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <TagTree tags={tagHierarchy} postCounts={tagPostCounts} />
      </div>
    </div>
  );
};

export default Home;