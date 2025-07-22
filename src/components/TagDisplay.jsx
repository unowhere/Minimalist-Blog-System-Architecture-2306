import React from 'react';
import { useBlog } from '../context/BlogContext';

const TagDisplay = ({ tags }) => {
  const { tags: allTags } = useBlog();

  const getTagName = (tagId) => {
    const tag = allTags.find(t => t.id === tagId);
    return tag ? tag.name : 'Unknown';
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tagId => (
        <span
          key={tagId}
          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
        >
          {getTagName(tagId)}
        </span>
      ))}
    </div>
  );
};

export default TagDisplay;