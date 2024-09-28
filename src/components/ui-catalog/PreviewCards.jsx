import React, { useState } from 'react';
import { Pencil, Upload, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const [editingIndex, setEditingIndex] = useState(null);

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

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index) => {
    setEditingIndex(null);
    // Here you would typically save the changes to a backend
  };

  const handleChange = (index, field, value) => {
    const newPreviewItems = [...previewItems];
    newPreviewItems[index][field] = value;
    setPreviewItems(newPreviewItems);
  };

  return (
    <>
      {previewItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative">
          <div className="relative mb-4">
            <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded" />
            <label className="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow-md">
              <Plus className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
              />
            </label>
          </div>
          {editingIndex === index ? (
            <>
              <Input 
                value={item.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                className="mb-2"
              />
              <Input 
                value={item.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="mb-2"
              />
              <Button onClick={() => handleSave(index)} className="mt-2">Save</Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <button onClick={() => handleEdit(index)} className="absolute bottom-2 right-2">
                <Pencil className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default PreviewCards;