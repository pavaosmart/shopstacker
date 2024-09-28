import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, FileText, Users, Settings, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from '../ThemeToggle';

const Sidebars = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/products' },
    { icon: <FileText size={20} />, label: 'Activity Logs', path: '/activity-logs' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={`bg-blue-500 text-white shadow-lg transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <span className="font-semibold">Menu</span>}
        <Button onClick={toggleSidebar} variant="ghost" size="sm" className="text-white hover:bg-blue-600">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      <nav className="flex-grow">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center p-4 hover:bg-blue-600 transition-colors"
          >
            {item.icon}
            {!isCollapsed && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-400">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebars;