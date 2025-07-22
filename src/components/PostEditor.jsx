import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import EnhancedTagSelector from './EnhancedTagSelector';
import CustomEditor from './CustomEditor';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiSave, FiX, FiBookmark } = FiIcons;

const PostEditor = ({ title, initialData, onSave, onCancel }) => {
  const { tags } = useBlog();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    tags: initialData?.tags || [],
    isPinned: initialData?.isPinned || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="w-[90%] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-light text-gray-900">{title}</h1>
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Title Input */}
        <div className="space-y-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-6 py-5 text-3xl font-light border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="Enter your post title..."
            required
          />
        </div>

        {/* Pin Post Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPinned"
            checked={formData.isPinned}
            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="isPinned" className="ml-2 block text-sm font-medium text-gray-700 flex items-center">
            <SafeIcon icon={FiBookmark} className="w-4 h-4 mr-1" />
            Pin this post to the top
          </label>
        </div>

        {/* Excerpt Input */}
        <div className="space-y-3">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400 resize-none"
            placeholder="Brief description of your post..."
          />
        </div>

        {/* Tags Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <EnhancedTagSelector
            selectedTags={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
          />
        </div>

        {/* Content Editor */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="rounded-xl overflow-hidden bg-white">
            <CustomEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              height={800}
            />
          </div>
        </div>

        {/* Action Buttons (Mobile) */}
        <div className="flex items-center justify-between pt-8 md:hidden">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;