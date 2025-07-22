import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import TagHierarchy from '../components/TagHierarchy';
import TagForm from '../components/TagForm';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiPlus } = FiIcons;

const TagManagement = () => {
  const { isAuthenticated } = useAuth();
  const { tags, createTag, updateTag, deleteTag, getTagHierarchy } = useBlog();
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = (tagData) => {
    if (editingTag) {
      updateTag(editingTag.id, tagData);
    } else {
      createTag(tagData);
    }
    setShowForm(false);
    setEditingTag(null);
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteTag(id);
    }
  };

  const hierarchy = getTagHierarchy();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Admin</span>
          </Link>
          <h1 className="text-3xl font-light text-gray-900">Tag Management</h1>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>New Tag</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <TagForm
            initialData={editingTag}
            allTags={tags}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingTag(null);
            }}
          />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-light text-gray-900 mb-6">Tag Hierarchy</h2>
        {hierarchy.length === 0 ? (
          <p className="text-gray-500">No tags created yet.</p>
        ) : (
          <TagHierarchy
            tags={hierarchy}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TagManagement;