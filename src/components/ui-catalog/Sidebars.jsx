import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, Settings, HelpCircle, Home, Briefcase, Calendar, Mail, Bell, FileText, Folder, Users, ShoppingCart, BarChart2, Layers, Globe, Bookmark, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Sidebars = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleFloatingSidebar = () => setIsFloatingOpen(!isFloatingOpen);

  const sidebarItems = [
    { icon: <Home size={20} />, label: 'Dashboard' },
    { icon: <Briefcase size={20} />, label: 'Projects' },
    { icon: <Calendar size={20} />, label: 'Calendar' },
    { icon: <Mail size={20} />, label: 'Messages' },
    { icon: <User size={20} />, label: 'Profile' },
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  const expandedSidebarItems = [
    ...sidebarItems,
    { icon: <Bell size={20} />, label: 'Notifications' },
    { icon: <FileText size={20} />, label: 'Documents' },
    { icon: <Folder size={20} />, label: 'Files' },
    { icon: <Users size={20} />, label: 'Team' },
    { icon: <ShoppingCart size={20} />, label: 'Orders' },
    { icon: <BarChart2 size={20} />, label: 'Analytics' },
    { icon: <Layers size={20} />, label: 'Integrations' },
    { icon: <Globe size={20} />, label: 'Explore' },
    { icon: <Bookmark size={20} />, label: 'Saved Items' },
    { icon: <Star size={20} />, label: 'Favorites' },
  ];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Sidebars</h2>
      <div className="flex space-x-4">
        {/* Collapsible Sidebar */}
        <div className={`bg-white shadow-lg rounded-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <div className="p-4 flex justify-between items-center">
            {!isCollapsed && <span className="font-semibold">Menu</span>}
            <Button onClick={toggleSidebar} variant="ghost" size="sm">
              {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
            </Button>
          </div>
          <nav>
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                {!isCollapsed && <span className="ml-4">{item.label}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Fixed Sidebar with expandable sections */}
        <div className="w-64 bg-white shadow-lg rounded-lg">
          <div className="p-4">
            <span className="font-semibold">Fixed Sidebar</span>
          </div>
          <nav>
            {expandedSidebarItems.map((item, index) => (
              <div key={index}>
                <Button
                  onClick={() => setActiveSection(activeSection === item.label ? '' : item.label)}
                  className="w-full flex items-center justify-between p-4 text-gray-700 hover:bg-gray-100 transition-colors"
                  variant="ghost"
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-4">{item.label}</span>
                  </div>
                  <ChevronRight className={`transform transition-transform ${activeSection === item.label ? 'rotate-90' : ''}`} size={20} />
                </Button>
                {activeSection === item.label && (
                  <div className="bg-gray-50 py-2 px-4">
                    <p>Expanded content for {item.label}</p>
                    <ul className="ml-4 mt-2">
                      <li className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Suboption 1</li>
                      <li className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer mt-1">Suboption 2</li>
                      <li className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer mt-1">Suboption 3</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Floating Sidebar */}
      <div className="relative">
        <Button
          onClick={toggleFloatingSidebar}
          className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        >
          <Menu size={20} />
        </Button>
        {isFloatingOpen && (
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out z-40">
            <Button onClick={toggleFloatingSidebar} className="absolute top-4 right-4" variant="ghost" size="sm">
              <X size={20} />
            </Button>
            <nav className="mt-8">
              {expandedSidebarItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  {item.icon}
                  <span className="ml-4">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Vertical Icon Bar */}
      <div className="fixed top-1/2 transform -translate-y-1/2 left-0 bg-gray-800 text-white p-2 rounded-r-lg shadow-lg">
        {sidebarItems.slice(0, 5).map((item, index) => (
          <Button key={index} className="block p-2 hover:bg-gray-700 rounded transition-colors" variant="ghost" size="sm" title={item.label}>
            {item.icon}
          </Button>
        ))}
      </div>

      {/* Minimalist Side Dots Navigation */}
      <div className="fixed top-1/2 transform -translate-y-1/2 right-4 flex flex-col items-center space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Button key={index} className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-500 transition-colors p-0" variant="ghost" size="sm" />
        ))}
      </div>
    </div>
  );
};

export default Sidebars;