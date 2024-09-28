import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Settings } from 'lucide-react';
import ComponentesUI from '../pages/ComponentesUI';
import LoginModal from './LoginModal';
import { Button } from "@/components/ui/button";

const UIComponentsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const panelRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const categories = [
    'Sidebars', 'Top Bars (Navigation Bars)', 'Buttons', 'Cards',
    'Dialogs/Modals', 'Tables', 'Forms', 'Typography',
    'Icons and Illustrations', 'Notifications and Toasts'
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizeHandleRef.current && resizeHandleRef.current.pressed) {
        const newWidth = document.body.clientWidth - e.clientX;
        const maxWidth = document.body.clientWidth * 0.8;
        setPanelWidth(Math.max(320, Math.min(newWidth, maxWidth)));
      }
    };

    const handleMouseUp = () => {
      if (resizeHandleRef.current) {
        resizeHandleRef.current.pressed = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleResizeMouseDown = () => {
    if (resizeHandleRef.current) {
      resizeHandleRef.current.pressed = true;
    }
  };

  const handleSettingsClick = () => {
    if (isLoggedIn) {
      setIsEditMode(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
      >
        UI
      </Button>
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col z-50"
          style={{ width: `${panelWidth}px` }}
        >
          <div
            ref={resizeHandleRef}
            className="absolute inset-y-0 left-0 w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400 z-50"
            onMouseDown={handleResizeMouseDown}
          />
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Components</h3>
              <div className="flex items-center">
                <button
                  onClick={handleSettingsClick}
                  className="text-gray-500 hover:text-gray-700 transition-colors mr-2"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {isLoggedIn ? (
              <>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Select a category</h4>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                    >
                      {selectedCategory || 'Select category'}
                      <ChevronDown size={20} className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {categories.map((category) => (
                          <button
                            key={category}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <ComponentesUI panelWidth={panelWidth} selectedCategory={selectedCategory} isEditMode={isEditMode} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Welcome to UI Components Kit</h2>
                <p className="text-gray-600 mb-8 text-center">Log in to access our library of customizable UI components.</p>
                <Button onClick={() => setIsLoginModalOpen(true)}>Log In</Button>
              </div>
            )}
          </div>
        </div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default UIComponentsPanel;