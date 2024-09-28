import React from 'react';

const Typography = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Typography</h2>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-3xl font-bold">Heading 2</h2>
        <h3 className="text-2xl font-bold">Heading 3</h3>
        <h4 className="text-xl font-bold">Heading 4</h4>
        <h5 className="text-lg font-bold">Heading 5</h5>
        <h6 className="text-base font-bold">Heading 6</h6>
      </div>

      <div className="space-y-4">
        <p className="text-base">
          This is a paragraph of body text. It demonstrates the default text size and line height.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
        </p>
        <p className="text-sm">
          This is smaller body text, useful for less important information or captions.
        </p>
      </div>

      <div className="space-y-4">
        <ul className="list-disc list-inside">
          <li>Unordered list item 1</li>
          <li>Unordered list item 2</li>
          <li>Unordered list item 3</li>
        </ul>

        <ol className="list-decimal list-inside">
          <li>Ordered list item 1</li>
          <li>Ordered list item 2</li>
          <li>Ordered list item 3</li>
        </ol>
      </div>

      <div className="space-y-2">
        <p className="font-bold">Bold text</p>
        <p className="italic">Italic text</p>
        <p className="underline">Underlined text</p>
        <p className="line-through">Strikethrough text</p>
      </div>

      <div>
        <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">This is a link</a>
      </div>

      <div className="space-y-1">
        <p className="text-xs">Extra small text</p>
        <p className="text-sm">Small text</p>
        <p className="text-base">Base text</p>
        <p className="text-lg">Large text</p>
        <p className="text-xl">Extra large text</p>
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