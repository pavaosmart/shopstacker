import React from 'react';

const Typography = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
        <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
        <h3 className="text-2xl font-bold mb-2">Heading 3</h3>
        <h4 className="text-xl font-bold mb-2">Heading 4</h4>
        <h5 className="text-lg font-bold mb-2">Heading 5</h5>
        <h6 className="text-base font-bold mb-2">Heading 6</h6>
      </div>

      <div>
        <p className="text-base mb-4">
          This is a paragraph of body text. It demonstrates the default text size and line height.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
        </p>
        <p className="text-sm mb-4">
          This is smaller body text, useful for less important information or captions.
        </p>
      </div>

      <div>
        <ul className="list-disc list-inside mb-4">
          <li>Unordered list item 1</li>
          <li>Unordered list item 2</li>
          <li>Unordered list item 3</li>
        </ul>

        <ol className="list-decimal list-inside mb-4">
          <li>Ordered list item 1</li>
          <li>Ordered list item 2</li>
          <li>Ordered list item 3</li>
        </ol>
      </div>

      <div>
        <p className="font-bold mb-2">Bold text</p>
        <p className="italic mb-2">Italic text</p>
        <p className="underline mb-2">Underlined text</p>
        <p className="line-through mb-2">Strikethrough text</p>
      </div>

      <div>
        <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">This is a link</a>
      </div>

      <div>
        <p className="text-xs mb-1">Extra small text</p>
        <p className="text-sm mb-1">Small text</p>
        <p className="text-base mb-1">Base text</p>
        <p className="text-lg mb-1">Large text</p>
        <p className="text-xl mb-1">Extra large text</p>
        <p className="text-2xl">2X large text</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">This is microcopy or helper text, often used for form fields or additional information.</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <code className="text-sm font-mono">This is an example of inline code.</code>
      </div>

      <blockquote className="border-l-4 border-gray-500 pl-4 italic">
        This is a blockquote. It's often used to highlight important information or quotes from others.
      </blockquote>
    </div>
  );
};

export default Typography;