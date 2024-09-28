import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';

const TopBars = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white shadow-md rounded-lg p-2 flex items-center">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      {/* Top Bar with Profile and Notifications */}
      <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Logo</span>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Projects</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Bell />
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 1</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 2</a>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <User />
              <span>John Doe</span>
              <ChevronDown />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="bg-white shadow-md rounded-lg p-4">
        <ol className="flex space-x-2 text-sm">
          <li><a href="#" className="text-blue-500 hover:underline">Home</a></li>
          <li className="text-gray-500">/</li>
          <li><a href="#" className="text-blue-500 hover:underline">Category</a></li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Current Page</li>
        </ol>
      </nav>
    </div>
  );
};

export default TopBars;