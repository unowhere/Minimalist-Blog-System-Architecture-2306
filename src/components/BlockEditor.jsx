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

const BlockEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Editor.js
    editorInstance.current = new EditorJS({
      holder: editorRef.current,
      placeholder: placeholder,
      minHeight: 0,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
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
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code here...'
          }
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
          }
        },
        marker: {
          class: Marker,
        },
        inlineCode: {
          class: InlineCode,
        }
      },
      data: value ? JSON.parse(value) : undefined,
      onChange: async () => {
        if (editorInstance.current && onChange) {
          try {
            const outputData = await editorInstance.current.save();
            onChange(JSON.stringify(outputData));
          } catch (error) {
            console.error('Saving failed:', error);
          }
        }
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

  return (
    <div className="block-editor-container">
      <div 
        ref={editorRef} 
        className="block-editor"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default BlockEditor;