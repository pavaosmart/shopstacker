import React, { useState } from 'react';
import { Pencil, Upload } from 'lucide-react';

const PreviewCards = ({ onEdit }) => {
  const [previewItems, setPreviewItems] = useState([
    { 
      title: 'UI Components', 
      description: 'Explore our collection of reusable UI components',
      image: 'https://via.placeholder.com/150'
    },
    { 
      title: 'Customization', 
      description: 'Easily customize components to fit your design',
      image: 'https://via.placeholder.com/150'
    },
    { 
      title: 'Responsive', 
      description: 'All components are fully responsive and mobile-friendly',
      image: 'https://via.placeholder.com/150'
    },
  ]);

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviewItems = [...previewItems];
        newPreviewItems[index].image = e.target.result;
        setPreviewItems(newPreviewItems);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {previewItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative">
          <img src={item.image} alt={item.title} className="w-full h-32 object-cover mb-4 rounded" />
          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
          <div className="absolute top-2 right-2 flex space-x-2">
            <label className="cursor-pointer">
              <Upload className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
              />
            </label>
            <button onClick={() => onEdit(index)}>
              <Pencil className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default PreviewCards;