import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Menu, Sun, Moon, Globe, ShoppingCart, Heart, LogOut, Settings, HelpCircle } from 'lucide-react';

const TopBars = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const languages = ['EN', 'ES', 'FR', 'DE', 'IT'];

  return (
    <div className="space-y-8">
      {/* Standard Top Bar */}
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 border-b">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New message from John</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your order has shipped</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New friend request</a>
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search-focused Top Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-gray-600 hover:text-gray-900">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
          <div className="relative">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
              <Globe />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`block px-4 py-2 text-sm ${selectedLanguage === lang ? 'bg-gray-100' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBars;
