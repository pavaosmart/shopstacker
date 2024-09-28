import React from 'react';
import { User, ThumbsUp, MessageSquare, Share, Heart, Bookmark, MoreVertical, Star, ShoppingCart, ArrowRight } from 'lucide-react';

const Cards = () => {
  return (
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Action
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition-colors">
              Learn More
            </button>
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
            <button className="ml-auto text-gray-500 hover:text-gray-700">
              <MoreVertical size={20} />
            </button>
          </div>
          <p className="mb-4">Just had an amazing experience at the new restaurant downtown! 🍽️ #foodie #yum</p>
          <img src="https://via.placeholder.com/400x300" alt="Post Image" className="w-full rounded-lg mb-4" />
          <div className="flex justify-between items-center text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <ThumbsUp size={20} />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <MessageSquare size={20} />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <Share size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* E-commerce Product Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src="https://via.placeholder.com/300x200" alt="Product Image" className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Wireless Headphones</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">New</span>
          </div>
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400" />
            <Star className="w-5 h-5 text-gray-300" />
            <span className="text-gray-600 text-sm ml-2">(4.0)</span>
          </div>
          <p className="text-gray-600 mb-4">High-quality wireless headphones with noise cancellation.</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">$129.99</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex items-center">
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Blog Post Preview Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src="https://via.placeholder.com/300x200" alt="Blog Post Image" className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span>May 15, 2023</span>
            <span className="mx-2">•</span>
            <span>5 min read</span>
          </div>
          <h3 className="font-semibold text-xl mb-2">10 Tips for Productive Remote Work</h3>
          <p className="text-gray-600 mb-4">Learn how to stay productive and maintain work-life balance while working from home.</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="https://via.placeholder.com/30" alt="Author Avatar" className="w-8 h-8 rounded-full mr-2" />
              <span className="text-sm text-gray-700">By Jane Smith</span>
            </div>
            <button className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
              Read More
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Weather Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md text-white p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-2xl">New York City</h3>
            <p className="text-lg">Partly Cloudy</p>
          </div>
          <span className="text-4xl font-bold">72°F</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="font-semibold">Mon</p>
            <p>68°F</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Tue</p>
            <p>72°F</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Wed</p>
            <p>75°F</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Thu</p>
            <p>71°F</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Fri</p>
            <p>69°F</p>
          </div>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <img src="https://via.placeholder.com/60" alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h3 className="font-semibold text-lg">Sarah Johnson</h3>
            <p className="text-gray-600">Marketing Manager</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">"This product has completely transformed our workflow. It's intuitive, powerful, and has saved us countless hours. I can't imagine running our business without it now."</p>
        <div className="flex items-center text-yellow-400">
          <Star size={20} />
          <Star size={20} />
          <Star size={20} />
          <Star size={20} />
          <Star size={20} />
        </div>
      </div>
    </div>
  );
};

export default Cards;