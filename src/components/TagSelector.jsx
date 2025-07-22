import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiChevronDown, FiChevronRight } = FiIcons;

const TagSelector = ({ selectedTags, onChange }) => {
  const { getTagHierarchy } = useBlog();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTags, setExpandedTags] = useState(new Set());

  const hierarchy = getTagHierarchy();

  const toggleTag = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onChange(newTags);
  };

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
      <div key={tag.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center space-x-2 py-1">
          {tag.children.length > 0 && (
            <button
              onClick={() => toggleExpanded(tag.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <SafeIcon 
                icon={expandedTags.has(tag.id) ? FiChevronDown : FiChevronRight} 
                className="w-3 h-3" 
              />
            </button>
          )}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">{tag.name}</span>
          </label>
        </div>
        {tag.children.length > 0 && expandedTags.has(tag.id) && (
          <div>
            {renderTagTree(tag.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getTagName = (tagId) => {
    const findTag = (tags) => {
      for (const tag of tags) {
        if (tag.id === tagId) return tag.name;
        const found = findTag(tag.children);
        if (found) return found;
      }
      return null;
    };
    return findTag(hierarchy) || 'Unknown';
  };

  return (
    <div className="relative">
      <div className="border border-gray-200 rounded-lg p-3 min-h-[48px] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {selectedTags.length === 0 ? (
          <span className="text-gray-500">Select tags...</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => (
              <span
                key={tagId}
                className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                <span>{getTagName(tagId)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(tagId);
                  }}
                  className="hover:text-gray-900"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-3">
            {hierarchy.length === 0 ? (
              <p className="text-gray-500 text-sm">No tags available</p>
            ) : (
              renderTagTree(hierarchy)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;