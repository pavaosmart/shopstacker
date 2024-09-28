import React from 'react';

const PreviewCards = () => {
  const previewItems = [
    { title: 'UI Components', description: 'Explore our collection of reusable UI components' },
    { title: 'Customization', description: 'Easily customize components to fit your design' },
    { title: 'Responsive', description: 'All components are fully responsive and mobile-friendly' },
  ];

  return (
    <>
      {previewItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </>
  );
};

export default PreviewCards;