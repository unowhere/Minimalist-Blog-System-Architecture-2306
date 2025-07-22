import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, 
  FiAlignRight, FiLink, FiImage, FiCode, FiMaximize2, FiMinimize2,
  FiEye, FiEyeOff, FiType, FiMoreHorizontal
} = FiIcons;

const CustomEditor = ({ value, onChange, height = 600 }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorHeight, setEditorHeight] = useState(height);

  useEffect(() => {
    if (isFullscreen) {
      setEditorHeight(window.innerHeight - 200);
    } else {
      setEditorHeight(height);
    }
  }, [isFullscreen, height]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = `<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px;" />`;
        insertHTML(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertHTML = (html) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      handleContentChange();
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter your code:');
    if (code) {
      const codeBlock = `<pre style="background-color: #1f2937; color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; font-family: 'Courier New', monospace;"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      insertHTML(codeBlock);
    }
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const headingText = selectedText || prompt(`Enter heading text:`);
    
    if (headingText) {
      const heading = `<h${level} style="font-weight: 300; color: #111827; margin: 2rem 0 1rem 0; font-size: ${level === 1 ? '2.5rem' : level === 2 ? '2rem' : level === 3 ? '1.75rem' : '1.5rem'}; line-height: 1.2;">${headingText}</h${level}>`;
      if (selectedText) {
        document.execCommand('insertHTML', false, heading);
      } else {
        insertHTML(heading);
      }
      handleContentChange();
    }
  };

  const insertQuote = () => {
    const quoteText = prompt('Enter quote text:');
    if (quoteText) {
      const quote = `<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #6b7280; font-size: 1.125rem;">${quoteText}</blockquote>`;
      insertHTML(quote);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatButtons = [
    { icon: FiBold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: FiItalic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: FiUnderline, command: 'underline', title: 'Underline (Ctrl+U)' },
  ];

  const alignButtons = [
    { icon: FiAlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: FiAlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: FiAlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className={`custom-editor-container ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : 'relative'}`}>
      {/* Toolbar */}
      <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Format buttons */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
              {formatButtons.map(({ icon, command, title }) => (
                <button
                  key={command}
                  onClick={() => execCommand(command)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title={title}
                >
                  <SafeIcon icon={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Heading buttons */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
              <button
                onClick={() => insertHeading(1)}
                className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => insertHeading(2)}
                className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => insertHeading(3)}
                className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                title="Heading 3"
              >
                H3
              </button>
            </div>

            {/* Alignment buttons */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
              {alignButtons.map(({ icon, command, title }) => (
                <button
                  key={command}
                  onClick={() => execCommand(command)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title={title}
                >
                  <SafeIcon icon={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* List buttons */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bullet List"
              >
                <SafeIcon icon={FiList} className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Numbered List"
              >
                <SafeIcon icon={FiType} className="w-4 h-4" />
              </button>
            </div>

            {/* Insert buttons */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
              <button
                onClick={insertLink}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Insert Link (Ctrl+K)"
              >
                <SafeIcon icon={FiLink} className="w-4 h-4" />
              </button>
              <button
                onClick={insertImage}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Insert Image"
              >
                <SafeIcon icon={FiImage} className="w-4 h-4" />
              </button>
              <button
                onClick={insertCodeBlock}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Insert Code Block"
              >
                <SafeIcon icon={FiCode} className="w-4 h-4" />
              </button>
              <button
                onClick={insertQuote}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Insert Quote"
              >
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* View controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              <SafeIcon icon={showPreview ? FiEyeOff : FiEye} className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <SafeIcon icon={isFullscreen ? FiMinimize2 : FiMaximize2} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex ${showPreview ? 'divide-x divide-gray-200' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-x border-gray-200`}>
          <div
            ref={editorRef}
            contentEditable
            className="w-full p-6 focus:outline-none overflow-y-auto bg-white"
            style={{ 
              height: `${editorHeight}px`,
              minHeight: '400px'
            }}
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: value || '' }}
            placeholder="Start writing your article..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-gray-100">
              <h3 className="font-medium text-gray-900">Preview</h3>
            </div>
            <div 
              className="p-6 overflow-y-auto prose prose-lg max-w-none"
              style={{ height: `${editorHeight}px` }}
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500">Start typing to see preview...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="border-x border-b border-gray-200 rounded-b-lg h-2 bg-white"></div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Keyboard shortcuts help */}
      <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>Ctrl+B: Bold</div>
        <div>Ctrl+I: Italic</div>
        <div>Ctrl+U: Underline</div>
        <div>Ctrl+K: Link</div>
      </div>
    </div>
  );
};

export default CustomEditor;