import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';
import Raw from '@editorjs/raw';
import Image from '@editorjs/image';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMaximize2, FiMinimize2, FiSave } = FiIcons;

const EnhancedBlockEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorHeight, setEditorHeight] = useState('600px');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Helper to upload images
  const uploadImageByFile = (file) => {
    return new Promise((resolve, reject) => {
      // In a real app, you would upload to a server or cloud storage
      // For this demo, we'll create object URLs
      try {
        const url = URL.createObjectURL(file);
        resolve({
          success: 1,
          file: {
            url: url
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setEditorHeight('calc(100vh - 120px)');
    } else {
      setEditorHeight('600px');
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Editor.js
    editorInstance.current = new EditorJS({
      holder: editorRef.current,
      placeholder: placeholder,
      autofocus: true,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          },
          shortcut: 'CMD+SHIFT+H'
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          },
          shortcut: 'CMD+SHIFT+L'
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
          shortcut: 'CMD+SHIFT+Q'
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code here...'
          },
          shortcut: 'CMD+SHIFT+C'
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
          }
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
          shortcut: 'CMD+SHIFT+T'
        },
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M'
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+I'
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              codesandbox: true,
              codepen: true,
              vimeo: true,
              twitter: true,
              instagram: true,
            }
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'https://jsonplaceholder.typicode.com/posts/1', // Placeholder, would usually be your backend endpoint
          }
        },
        raw: {
          class: Raw,
          config: {
            placeholder: 'Enter HTML or embed code here'
          }
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: uploadImageByFile
            },
            captionPlaceholder: 'Type caption (optional)'
          }
        }
      },
      data: value ? JSON.parse(value) : undefined,
      onChange: async () => {
        setUnsavedChanges(true);
      },
      onReady: () => {
        setIsReady(true);
      }
    });

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && editorInstance.current && value) {
      try {
        const data = JSON.parse(value);
        editorInstance.current.render(data);
      } catch (error) {
        console.error('Error parsing editor data:', error);
      }
    }
  }, [value, isReady]);

  const saveContent = async () => {
    if (editorInstance.current && onChange) {
      try {
        const outputData = await editorInstance.current.save();
        onChange(JSON.stringify(outputData));
        setUnsavedChanges(false);
      } catch (error) {
        console.error('Saving failed:', error);
      }
    }
  };

  return (
    <div className={`enhanced-block-editor-container relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Editor Controls */}
      <div className="flex items-center justify-between mb-4 px-4 py-2 bg-gray-50 rounded-t-xl border-b border-gray-200">
        <div className="text-sm text-gray-500">
          {unsavedChanges ? 'Unsaved changes' : 'All changes saved'}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={saveContent}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${unsavedChanges ? 'text-blue-600' : 'text-gray-400'}`}
            disabled={!unsavedChanges}
          >
            <SafeIcon icon={FiSave} className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={isFullscreen ? FiMinimize2 : FiMaximize2} className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Editor Container */}
      <div 
        className="relative overflow-y-auto bg-white shadow-inner rounded-b-xl border border-gray-200"
        style={{ height: editorHeight, transition: 'height 0.3s ease' }}
      >
        <div 
          ref={editorRef} 
          className="enhanced-block-editor"
        />
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div>⌘+⇧+H: Header</div>
        <div>⌘+⇧+L: List</div>
        <div>⌘+⇧+Q: Quote</div>
        <div>⌘+⇧+C: Code</div>
        <div>⌘+⇧+T: Table</div>
        <div>⌘+⇧+I: Inline Code</div>
      </div>
    </div>
  );
};

export default EnhancedBlockEditor;