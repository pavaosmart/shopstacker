import React from 'react';
import { Edit, Trash, Download, Share, Settings, User, Bell, Search } from 'lucide-react';

const IconsAndIllustrations = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Icon Buttons</h3>
        <div className="flex space-x-4">
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Icon with Text</h3>
        <div className="flex flex-col space-y-2">
          <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 text-green-500 hover:text-green-700 transition-colors">
            <User size={20} />
            <span>Profile</span>
          </button>
          <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-700 transition-colors">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Illustrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <svg className="w-32 h-32 mx-auto mb-4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="#4CAF50" />
              <path d="M60 100 L90 130 L140 80" stroke="white" strokeWidth="10" fill="none" />
            </svg>
            <p className="text-lg font-semibold">Success Illustration</p>
            <p className="text-gray-600">Used for successful actions or empty states</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <svg className="w-32 h-32 mx-auto mb-4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="40" width="120" height="120" rx="20" fill="#2196F3" />
              <circle cx="100" cy="90" r="30" fill="white" />
              <rect x="70" y="135" width="60" height="10" rx="5" fill="white" />
            </svg>
            <p className="text-lg font-semibold">Profile Illustration</p>
            <p className="text-gray-600">Used for user profiles or account pages</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Icon in Input</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
};

export default IconsAndIllustrations;