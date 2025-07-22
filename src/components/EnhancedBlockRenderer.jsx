import React from 'react';

const EnhancedBlockRenderer = ({ content }) => {
  if (!content) return null;

  let parsedContent;
  try {
    parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  if (!parsedContent?.blocks) {
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  const renderBlock = (block) => {
    const { type, data, id } = block;

    switch (type) {
      case 'header':
        const HeaderTag = `h${data.level}`;
        return (
          <HeaderTag 
            key={id} 
            className={`font-light text-gray-900 leading-tight mb-6 ${
              data.level === 1 ? 'text-5xl' :
              data.level === 2 ? 'text-4xl' :
              data.level === 3 ? 'text-3xl' :
              data.level === 4 ? 'text-2xl' :
              data.level === 5 ? 'text-xl' : 'text-lg'
            }`}
          >
            {data.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p 
            key={id} 
            className="text-gray-700 leading-relaxed mb-6 text-lg"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        );

      case 'list':
        const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={id} className="mb-8 pl-6 space-y-3">
            {data.items.map((item, index) => (
              <li 
                key={index} 
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={id} className="border-l-4 border-gray-300 pl-6 py-4 mb-8 italic">
            <p className="text-2xl text-gray-700 leading-relaxed mb-3">{data.text}</p>
            {data.caption && (
              <cite className="text-gray-500 text-base block">— {data.caption}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={id} className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-8 text-sm">
            <code className="font-mono">{data.code}</code>
          </pre>
        );

      case 'delimiter':
        return (
          <div key={id} className="text-center my-12">
            <div className="inline-flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={id} className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <tbody className="divide-y divide-gray-200">
                {data.content.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-50" : ""}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 text-gray-700 border border-gray-200 text-base">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'warning':
        return (
          <div key={id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            {data.title && (
              <h4 className="font-medium text-yellow-800 mb-2 text-lg">{data.title}</h4>
            )}
            <p className="text-yellow-700 text-base">{data.message}</p>
          </div>
        );

      case 'checklist':
        return (
          <div key={id} className="mb-8">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 mb-3">
                <div className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded border ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center`}>
                  {item.checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700 text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        );

      case 'image':
        return (
          <figure key={id} className="mb-8">
            <img 
              src={data.file.url} 
              alt={data.caption || 'Article image'} 
              className="w-full rounded-lg shadow-md"
            />
            {data.caption && (
              <figcaption className="text-center text-gray-500 mt-3 text-sm">{data.caption}</figcaption>
            )}
          </figure>
        );

      case 'embed':
        return (
          <div key={id} className="mb-8">
            <div 
              className="relative overflow-hidden rounded-lg shadow-md" 
              style={{paddingBottom: '56.25%'}} // 16:9 aspect ratio
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={data.embed}
                title="Embedded content"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {data.caption && (
              <figcaption className="text-center text-gray-500 mt-3 text-sm">{data.caption}</figcaption>
            )}
          </div>
        );

      case 'raw':
        return (
          <div 
            key={id} 
            className="mb-8 custom-html-content" 
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        );

      case 'linkTool':
        return (
          <div key={id} className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <a 
              href={data.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="p-6">
                <h4 className="text-xl font-medium text-gray-900 mb-2">{data.meta.title || data.link}</h4>
                {data.meta.description && (
                  <p className="text-gray-600 mb-2 line-clamp-2">{data.meta.description}</p>
                )}
                <div className="text-sm text-gray-500">{data.link}</div>
              </div>
              {data.meta.image && (
                <div className="border-t border-gray-100">
                  <img 
                    src={data.meta.image.url} 
                    alt={data.meta.title || 'Link preview'} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </a>
          </div>
        );

      default:
        return (
          <div key={id} className="mb-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              {data.text || JSON.stringify(data)}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {parsedContent.blocks.map(renderBlock)}
    </div>
  );
};

export default EnhancedBlockRenderer;