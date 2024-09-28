import React from 'react';
import { User, ThumbsUp, MessageSquare } from 'lucide-react';

const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Actionable Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">Actionable Card</h3>
          <p className="text-gray-600 mb-4">This is a card with hover effects and buttons.</p>
          <div className="flex justify-between">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Action
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Monthly Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New Users</span>
            <span className="font-semibold">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Revenue</span>
            <span className="font-semibold">$56,789</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Projects</span>
            <span className="font-semibold">23</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-24"></div>
        <div className="relative px-4 pb-4">
          <div className="absolute -top-12 left-4">
            <img src="https://via.placeholder.com/80" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />
          </div>
          <div className="pt-16">
            <h3 className="font-semibold text-lg">Jane Doe</h3>
            <p className="text-gray-600 mb-4">UX Designer</p>
            <div className="flex space-x-4 text-gray-500">
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>1.2k</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>456</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>789</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;