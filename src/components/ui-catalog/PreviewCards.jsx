import React, { useState } from 'react';
import { MoreVertical, Upload, Pencil } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PreviewCards = ({ isEditMode, onCategorySelect }) => {
  const [previewItems, setPreviewItems] = useState([
    { 
      id: '001',
      title: 'Dialog Confirmations', 
      description: 'Explore our collection of dialog confirmation components',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '002',
      title: 'Top Bars', 
      description: 'Navigation bars for easy site navigation',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '003',
      title: 'Buttons', 
      description: 'Various button styles for different actions',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '004',
      title: 'Cards', 
      description: 'Versatile card components for displaying content',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '005',
      title: 'Dialogs/Modals', 
      description: 'Pop-up dialogs and modal windows',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '006',
      title: 'Tables', 
      description: 'Data tables for organizing information',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '007',
      title: 'Forms', 
      description: 'Input forms and form elements',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '008',
      title: 'Typography', 
      description: 'Text styles and formatting options',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '009',
      title: 'Icons and Illustrations', 
      description: 'A collection of icons and illustrations',
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: '010',
      title: 'Notifications and Toasts', 
      description: 'Alert and notification components',
      image: 'https://via.placeholder.com/150'
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

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
    setShowOptions(null);
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

  const toggleOptions = (index) => {
    setShowOptions(showOptions === index ? null : index);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {previewItems.map((item, index) => (
          <Tooltip key={item.id}>
            <TooltipTrigger>
              <div 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => onCategorySelect(item.title)}
              >
                <div className="relative mb-4">
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded" />
                  {isEditMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOptions(index);
                      }} 
                      className="absolute top-2 right-2 p-1"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  )}
                  {isEditMode && showOptions === index && (
                    <div className="absolute top-10 right-2 bg-white rounded shadow-md p-2">
                      <label className="cursor-pointer block mb-2">
                        <Upload className="w-5 h-5 text-gray-500 hover:text-gray-700 inline mr-2" />
                        <span>Upload Image</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            e.stopPropagation();
                            handleImageUpload(index, e);
                          }}
                        />
                      </label>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }} 
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="w-5 h-5 mr-2" />
                        <span>Edit Text</span>
                      </button>
                    </div>
                  )}
                </div>
                {isEditMode && editingIndex === index ? (
                  <>
                    <Input 
                      value={item.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      className="mb-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Input 
                      value={item.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      className="mb-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(index);
                      }} 
                      className="mt-2"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">{item.id} - {item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Component {item.id}: {item.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default PreviewCards;