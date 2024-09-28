import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, Settings, HelpCircle } from 'lucide-react';

const Sidebars = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const sidebarItems = [
    { icon: <User />, label: 'Profile' },
    { icon: <Settings />, label: 'Settings' },
    { icon: <HelpCircle />, label: 'Help' },
  ];

  return (
    <div className="flex space-x-4">
      {/* Collapsible Sidebar */}
      <div className={`bg-white shadow-lg rounded-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex justify-between items-center">
          {!isCollapsed && <span className="font-semibold">Menu</span>}
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            {isCollapsed ? <ChevronRight /> : <X />}
          </button>
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
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => setActiveSection(activeSection === item.label ? '' : item.label)}
                className="w-full flex items-center justify-between p-4 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-4">{item.label}</span>
                </div>
                <ChevronRight className={`transform transition-transform ${activeSection === item.label ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === item.label && (
                <div className="bg-gray-50 py-2 px-4">
                  <p>Expanded content for {item.label}</p>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Floating Sidebar */}
      <div className="relative">
        <button className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          <Menu />
        </button>
      </div>
    </div>
  );
};

export default Sidebars;