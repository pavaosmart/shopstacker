import React from 'react';
import { Plus, Edit, Trash, Download, Share, Settings, User, Bell, Search, ArrowRight, ArrowLeft, Check, X, Heart, ShoppingCart, Play, Pause, ChevronDown, ChevronUp, Menu, RefreshCw } from 'lucide-react';

const Buttons = () => {
  return (
    <div className="space-y-8">
      {/* Standard Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Standard Buttons</h3>
        <div className="space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Primary Button
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
            Secondary Button
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Success Button
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Danger Button
          </button>
        </div>
      </div>

      {/* Outlined Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Outlined Buttons</h3>
        <div className="space-x-4">
          <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors">
            Outlined Primary
          </button>
          <button className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors">
            Outlined Secondary
          </button>
          <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors">
            Outlined Success
          </button>
          <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded transition-colors">
            Outlined Danger
          </button>
        </div>
      </div>

      {/* Icon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Icon Buttons</h3>
        <div className="space-x-4">
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            <Edit size={20} />
          </button>
          <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            <Trash size={20} />
          </button>
          <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            <Download size={20} />
          </button>
          <button className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Text with Icon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Text with Icon Buttons</h3>
        <div className="space-x-4">
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            <User size={20} />
            <span>Profile</span>
          </button>
          <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Floating Action Button (FAB)</h3>
        <div className="space-x-4">
          <button className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Toggle Buttons</h3>
        <div className="space-x-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
            <Play size={20} />
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
            <Pause size={20} />
          </button>
        </div>
      </div>

      {/* Button Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Button Groups</h3>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
            Profile
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
            Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
            Messages
          </button>
        </div>
      </div>

      {/* Loading Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Loading Buttons</h3>
        <div className="space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center">
            <RefreshCw className="animate-spin mr-2" size={20} />
            Loading...
          </button>
        </div>
      </div>

      {/* Gradient Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Gradient Buttons</h3>
        <div className="space-x-4">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Gradient Button
          </button>
        </div>
      </div>

      {/* Social Media Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Social Media Buttons</h3>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
            Facebook
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors">
            Twitter
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors">
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buttons;