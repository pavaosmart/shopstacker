import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Menu, Sun, Moon, Globe, ShoppingCart, Heart, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TopBars = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const languages = ['EN', 'ES', 'FR', 'DE', 'IT'];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Top Bars (Navigation Bars)</h2>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>New message from John</DropdownMenuItem>
              <DropdownMenuItem>Your order has shipped</DropdownMenuItem>
              <DropdownMenuItem>New friend request</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                John Doe
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search-focused Top Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map(lang => (
                <DropdownMenuItem key={lang} onSelect={() => setSelectedLanguage(lang)}>
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* E-commerce Top Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Shop Logo</span>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Categories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Deals</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
          <Button variant="ghost" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart (3)
          </Button>
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>

      {/* Mobile-friendly Top Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm">
          <Menu size={24} />
        </Button>
        <span className="font-semibold">Mobile App</span>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBars;