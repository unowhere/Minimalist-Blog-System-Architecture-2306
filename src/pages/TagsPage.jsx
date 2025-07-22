import React from 'react';
import { motion } from 'framer-motion';
import { useBlog } from '../context/BlogContext';
import TagTree from '../components/TagTree';

const TagsPage = () => {
  const { getTagHierarchy, getTagPostCount } = useBlog();

  // Get tag hierarchy and post counts
  const tagHierarchy = getTagHierarchy();
  const tagPostCounts = getTagPostCount();

  // Calculate total posts by tag category
  const calculateTotalPosts = () => {
    return Object.values(tagPostCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <h1 className="text-3xl font-light text-gray-900">Browse by Tags</h1>
        <p className="text-gray-600">
          Browse articles by topic - {calculateTotalPosts()} articles across {Object.keys(tagPostCounts).length} tags
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        {tagHierarchy.length === 0 ? (
          <p className="text-gray-500">No tags available yet.</p>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">
              Click on any tag to see all articles in that category. Numbers in parentheses indicate the number of articles.
            </p>
            <TagTree 
              tags={tagHierarchy} 
              postCounts={tagPostCounts} 
              className="w-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TagsPage;