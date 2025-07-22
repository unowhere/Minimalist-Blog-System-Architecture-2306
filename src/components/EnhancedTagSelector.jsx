import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlog } from '../context/BlogContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiChevronDown, FiChevronRight, FiPlus, FiEdit3, FiCheck, FiXCircle } = FiIcons;

const EnhancedTagSelector = ({ selectedTags, onChange }) => {
  const { getTagHierarchy, createTag, updateTag } = useBlog();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTags, setExpandedTags] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [newTagForm, setNewTagForm] = useState({
    name: '',
    description: '',
    parentId: null
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const hierarchy = getTagHierarchy();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingTag(null);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

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

  const handleCreateTag = async () => {
    if (!newTagForm.name.trim()) return;
    
    try {
      const tagId = createTag(newTagForm);
      onChange([...selectedTags, tagId]);
      setNewTagForm({ name: '', description: '', parentId: null });
      setIsCreating(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleEditTag = async (tagId, tagData) => {
    try {
      updateTag(tagId, tagData);
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const filterTags = (tags, searchTerm) => {
    if (!searchTerm) return tags;
    
    return tags.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingChildren = tag.children && filterTags(tag.children, searchTerm).length > 0;
      return matchesSearch || hasMatchingChildren;
    }).map(tag => ({
      ...tag,
      children: tag.children ? filterTags(tag.children, searchTerm) : []
    }));
  };

  const renderTagTree = (tags, level = 0) => {
    const filteredTags = filterTags(tags, searchTerm);
    
    return filteredTags.map(tag => (
      <motion.div
        key={tag.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        style={{ marginLeft: `${level * 20}px` }}
        className="mb-1"
      >
        {editingTag?.id === tag.id ? (
          <EditTagForm
            tag={tag}
            onSave={(data) => handleEditTag(tag.id, data)}
            onCancel={() => setEditingTag(null)}
          />
        ) : (
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
            <div className="flex items-center space-x-2 flex-1">
              {tag.children.length > 0 && (
                <button
                  onClick={() => toggleExpanded(tag.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <SafeIcon 
                    icon={expandedTags.has(tag.id) ? FiChevronDown : FiChevronRight} 
                    className="w-3 h-3 text-gray-500" 
                  />
                </button>
              )}
              <label className="flex items-center space-x-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-700 font-medium">{tag.name}</span>
                  {tag.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{tag.description}</p>
                  )}
                </div>
              </label>
            </div>
            <button
              onClick={() => setEditingTag(tag)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
            >
              <SafeIcon icon={FiEdit3} className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        )}
        
        {tag.children.length > 0 && expandedTags.has(tag.id) && (
          <div className="mt-1">
            {renderTagTree(tag.children, level + 1)}
          </div>
        )}
      </motion.div>
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
    <div className="relative" ref={dropdownRef}>
      <div 
        className="border border-gray-200 rounded-lg p-4 min-h-[60px] cursor-pointer hover:border-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTags.length === 0 ? (
          <span className="text-gray-500">Select or create tags...</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => (
              <motion.span
                key={tagId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{getTagName(tagId)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(tagId);
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="max-h-48 overflow-y-auto p-2">
              {hierarchy.length === 0 && !isCreating ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">No tags available</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-sm text-gray-900 hover:text-gray-700 font-medium"
                  >
                    Create your first tag
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {renderTagTree(hierarchy)}
                </AnimatePresence>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              {isCreating ? (
                <CreateTagForm
                  formData={newTagForm}
                  onChange={setNewTagForm}
                  onSave={handleCreateTag}
                  onCancel={() => {
                    setIsCreating(false);
                    setNewTagForm({ name: '', description: '', parentId: null });
                  }}
                  availableParents={hierarchy}
                />
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Create new tag</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreateTagForm = ({ formData, onChange, onSave, onCancel, availableParents }) => {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        placeholder="Tag name"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        autoFocus
      />
      <textarea
        value={formData.description}
        onChange={(e) => onChange({ ...formData, description: e.target.value })}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
      />
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          disabled={!formData.name.trim()}
          className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <SafeIcon icon={FiCheck} className="w-3 h-3" />
          <span>Create</span>
        </button>
        <button
          onClick={onCancel}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          <SafeIcon icon={FiXCircle} className="w-3 h-3" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

const EditTagForm = ({ tag, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: tag.name,
    description: tag.description || ''
  });

  const handleSave = () => {
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-2">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-transparent"
          autoFocus
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description (optional)"
          rows={1}
          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-gray-900 focus:border-transparent resize-none"
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 bg-gray-900 text-white px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
          >
            <SafeIcon icon={FiCheck} className="w-3 h-3" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiXCircle} className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTagSelector;