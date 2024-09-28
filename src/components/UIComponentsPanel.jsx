import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

const UIComponentsPanel = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('App elements');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { name: 'App elements', count: 11 },
    { name: 'Marketing', count: 9 },
    { name: 'Sidebars', count: 4 },
    { name: 'Footers', count: 2 },
    { name: 'Lists & feeds', count: 9 },
    { name: 'Inputs & forms', count: 9 },
  ];

  const components = [
    { name: 'Newsletter Sign Up', preview: 'https://via.placeholder.com/300x150?text=Newsletter+Sign+Up' },
    { name: 'User Profile', preview: 'https://via.placeholder.com/300x150?text=User+Profile' },
    { name: 'Comment Section', preview: 'https://via.placeholder.com/300x150?text=Comment+Section' },
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Components</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Drag & drop UI components</h4>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              {selectedCategory}
              <ChevronDown size={20} className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">{categories.find(c => c.name === selectedCategory).count} Components</p>
        </div>
        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-2">
              <img src={component.preview} alt={component.name} className="w-full h-auto mb-2 rounded-md" />
              <p className="text-sm font-medium">{component.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIComponentsPanel;