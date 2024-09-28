import React from 'react';
import { User, ThumbsUp, MessageSquare, Share, Heart, Bookmark, MoreVertical, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Cards = () => {
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Basic Card</h3>
            <p className="text-gray-600">This is a basic card with an image and some text content.</p>
          </div>
        </div>

        {/* Actionable Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Actionable Card</h3>
            <p className="text-gray-600 mb-4">This is a card with hover effects and buttons.</p>
            <div className="flex justify-between">
              <Button>Action</Button>
              <Button variant="outline">Learn More</Button>
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

        {/* Social Media Post Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img src="https://via.placeholder.com/40" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-semibold">John Smith</h4>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <MoreVertical size={20} />
              </Button>
            </div>
            <p className="mb-4">Just had an amazing experience at the new restaurant downtown! 🍽️ #foodie #yum</p>
            <img src="https://via.placeholder.com/400x300" alt="Post Image" className="w-full rounded-lg mb-4" />
            <div className="flex justify-between items-center text-gray-500">
              <Button variant="ghost" size="sm" className="flex items-center">
                <ThumbsUp size={20} className="mr-2" />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <MessageSquare size={20} className="mr-2" />
                <span>Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Share size={20} className="mr-2" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;