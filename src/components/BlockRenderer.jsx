import React from 'react';

const BlockRenderer = ({ content }) => {
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
    const { type, data } = block;

    switch (type) {
      case 'header':
        const HeaderTag = `h${data.level}`;
        return (
          <HeaderTag 
            key={block.id} 
            className={`font-light text-gray-900 leading-tight mb-4 ${
              data.level === 1 ? 'text-4xl' :
              data.level === 2 ? 'text-3xl' :
              data.level === 3 ? 'text-2xl' :
              data.level === 4 ? 'text-xl' :
              data.level === 5 ? 'text-lg' : 'text-base'
            }`}
          >
            {data.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p 
            key={block.id} 
            className="text-gray-700 leading-relaxed mb-6 text-lg"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        );

      case 'list':
        const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={block.id} className="mb-6 pl-6 space-y-2">
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
          <blockquote key={block.id} className="border-l-4 border-gray-200 pl-6 py-4 mb-6 italic">
            <p className="text-xl text-gray-700 leading-relaxed mb-2">{data.text}</p>
            {data.caption && (
              <cite className="text-gray-500 text-sm">— {data.caption}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={block.id} className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
            <code>{data.code}</code>
          </pre>
        );

      case 'delimiter':
        return (
          <div key={block.id} className="text-center my-8">
            <div className="inline-flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={block.id} className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {data.content.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-gray-700 border border-gray-200">
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
          <div key={block.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            {data.title && (
              <h4 className="font-medium text-yellow-800 mb-2">{data.title}</h4>
            )}
            <p className="text-yellow-700">{data.message}</p>
          </div>
        );

      default:
        return (
          <div key={block.id} className="mb-6">
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

export default BlockRenderer;