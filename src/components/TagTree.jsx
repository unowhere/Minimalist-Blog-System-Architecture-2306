import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronRight } = FiIcons;

const TagTree = ({ tags, postCounts, linkTo = "tag" }) => {
  const [expandedTags, setExpandedTags] = useState(new Set());

  const toggleExpanded = (tagId) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedTags(newExpanded);
  };

  const renderTagTree = (tags, level = 0) => {
    return tags.map(tag => (
      <motion.div
        key={tag.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="mb-2"
      >
        <div
          className="flex items-center group"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {tag.children.length > 0 ? (
            <button
              onClick={() => toggleExpanded(tag.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors mr-2"
            >
              <SafeIcon
                icon={expandedTags.has(tag.id) ? FiChevronDown : FiChevronRight}
                className="w-4 h-4 text-gray-600"
              />
            </button>
          ) : (
            <div className="w-6 mr-2"></div>
          )}

          <Link
            to={`/${linkTo}/${tag.id}`}
            className="text-gray-800 hover:text-gray-600 transition-colors flex-1 flex items-center"
          >
            <span className="text-base">{tag.name}</span>
            <span className="text-sm text-gray-500 ml-2">
              ({postCounts[tag.id] || 0})
            </span>
          </Link>
        </div>

        <AnimatePresence>
          {tag.children.length > 0 && expandedTags.has(tag.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              {renderTagTree(tag.children, level + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    ));
  };

  return (
    <div className="tag-tree border border-gray-200 rounded-lg p-4 w-full">
      <h3 className="text-xl font-light text-gray-900 mb-4">Tags</h3>
      {tags.length === 0 ? (
        <p className="text-gray-500">No tags available</p>
      ) : (
        renderTagTree(tags)
      )}
    </div>
  );
};

export default TagTree;