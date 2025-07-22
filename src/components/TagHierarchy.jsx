import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronRight, FiEdit3, FiTrash2 } = FiIcons;

const TagHierarchy = ({ tags, onEdit, onDelete }) => {
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
      <div key={tag.id} className="space-y-2">
        <div 
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-2">
            {tag.children.length > 0 && (
              <button
                onClick={() => toggleExpanded(tag.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <SafeIcon 
                  icon={expandedTags.has(tag.id) ? FiChevronDown : FiChevronRight} 
                  className="w-4 h-4" 
                />
              </button>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{tag.name}</h3>
              {tag.description && (
                <p className="text-sm text-gray-600">{tag.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(tag)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <SafeIcon icon={FiEdit3} className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(tag.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {tag.children.length > 0 && expandedTags.has(tag.id) && (
          <div>
            {renderTagTree(tag.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-2">
      {renderTagTree(tags)}
    </div>
  );
};

export default TagHierarchy;