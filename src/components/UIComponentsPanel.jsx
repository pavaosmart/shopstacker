import React, { useState } from 'react';
import { X } from 'lucide-react';

const UIComponentsPanel = ({ isOpen, onClose }) => {
  const components = [
    { name: 'Buttons', count: 8 },
    { name: 'Cards', count: 6 },
    { name: 'Forms', count: 5 },
    { name: 'Marketing', count: 9 },
    { name: 'Sidebars', count: 4 },
    { name: 'Footers', count: 2 },
    { name: 'Lists & feeds', count: 9 },
    { name: 'Inputs & forms', count: 9 },
    { name: 'App elements', count: 11 },
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
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
        <div className="space-y-2">
          {components.map((component, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span>{component.name}</span>
              <span className="text-sm text-gray-500">{component.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIComponentsPanel;