import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import ComponentesUI from '../pages/ComponentesUI';

const UIComponentsPanel = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('Sidebars');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    'Sidebars',
    'Top Bars (Navigation Bars)',
    'Buttons',
    'Cards',
    'Dialogs/Modals',
    'Tables',
    'Forms',
    'Typography',
    'Icons and Illustrations',
    'Notifications and Toasts'
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
                    key={category}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <ComponentesUI />
      </div>
    </div>
  );
};

export default UIComponentsPanel;