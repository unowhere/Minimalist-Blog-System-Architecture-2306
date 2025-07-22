import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

const AdvancedEditor = ({ value, onChange, height = 800 }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content) => {
    // Sanitize content before saving
    const sanitizedContent = DOMPurify.sanitize(content);
    onChange(sanitizedContent);
  };

  return (
    <div className="advanced-editor-container">
      <Editor
        apiKey="no-api-key" // This allows using TinyMCE without an API key for development
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'codesample', 'emoticons', 'hr', 'nonbreaking', 'pagebreak', 'quickbars',
            'save', 'autoresize', 'directionality', 'visualchars'
          ],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image media link codesample | code fullscreen',
          content_style: `
            body {font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size: 16px;line-height: 1.6;}
            p {margin: 0 0 1em 0;}
            h1,h2,h3,h4,h5,h6 {font-weight: 300;margin: 1.5em 0 0.5em 0;}
            h1 {font-size: 2.5em;}
            h2 {font-size: 2em;}
            h3 {font-size: 1.75em;}
            h4 {font-size: 1.5em;}
            h5 {font-size: 1.25em;}
            h6 {font-size: 1em;}
            img {max-width: 100%;height: auto;}
            pre {background-color: #f5f5f5;padding: 1em;border-radius: 4px;overflow-x: auto;}
            blockquote {border-left: 4px solid #e5e5e5;padding-left: 1em;margin-left: 0;}
            table {border-collapse: collapse;width: 100%;}
            table td,table th {border: 1px solid #e5e5e5;padding: 0.5em;}
          `,
          images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
            // For this demo, we'll create an object URL
            // In production, you'd upload to a server
            try {
              const url = URL.createObjectURL(blobInfo.blob());
              resolve(url);
            } catch (e) {
              reject('Image upload failed');
            }
          }),
          file_picker_types: 'image',
          promotion: false,
          branding: false,
          resize: true,
          statusbar: true,
          browser_spellcheck: true,
          contextmenu: true,
          autoresize_bottom_margin: 50,
          autoresize_overflow_padding: 50,
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          entity_encoding: 'raw',
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
        }}
      />
    </div>
  );
};

export default AdvancedEditor;