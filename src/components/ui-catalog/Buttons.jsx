import React from 'react';
import { Settings, User, Bell, Search, ArrowRight, ArrowLeft, Check, X, Heart, ShoppingCart, Play, Pause, ChevronDown, ChevronUp, Menu, RefreshCw } from 'lucide-react';

const Buttons = ({ onComponentClick }) => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Buttons</h2>
      
      {/* Standard Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Standard Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Primary Button')}
          >
            Primary Button
          </button>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Secondary Button')}
          >
            Secondary Button
          </button>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Success Button')}
          >
            Success Button
          </button>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Danger Button')}
          >
            Danger Button
          </button>
        </div>
      </div>

      {/* Outlined Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Outlined Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Outlined Primary Button')}
          >
            Outlined Primary
          </button>
          <button 
            className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Outlined Secondary Button')}
          >
            Outlined Secondary
          </button>
          <button 
            className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Outlined Success Button')}
          >
            Outlined Success
          </button>
          <button 
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Outlined Danger Button')}
          >
            Outlined Danger
          </button>
        </div>
      </div>

      {/* Icon Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Icon Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => onComponentClick('Settings Icon Button')}
          >
            <Settings size={20} />
          </button>
          <button 
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => onComponentClick('Close Icon Button')}
          >
            <X size={20} />
          </button>
          <button 
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => onComponentClick('Check Icon Button')}
          >
            <Check size={20} />
          </button>
          <button 
            className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            onClick={() => onComponentClick('Bell Icon Button')}
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Text with Icon Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Text with Icon Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Settings Button with Icon')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Profile Button with Icon')}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => onComponentClick('Notifications Button with Icon')}
          >
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buttons;