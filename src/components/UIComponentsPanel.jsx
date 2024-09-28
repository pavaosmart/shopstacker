import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Settings, LogOut } from 'lucide-react';
import ComponentesUI from '../pages/ComponentesUI';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from './ConfirmationDialog';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const UIComponentsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const panelRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const dropdownRef = useRef(null);
  const { session, login, logout } = useSupabaseAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    'Sidebars', 'Top Bars (Navigation Bars)', 'Buttons', 'Cards',
    'Dialogs/Modals', 'Tables', 'Forms', 'Typography',
    'Icons and Illustrations', 'Notifications and Toasts'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsEditMode(!isEditMode);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  const handleComponentClick = (componentName) => {
    setSelectedComponent(componentName);
    setIsDialogOpen(true);
  };

  const handleConfirmImplementation = () => {
    const currentPage = location.pathname.slice(1) || 'index';
    implementComponent(selectedComponent, currentPage);
    setIsDialogOpen(false);
  };

  const implementComponent = (componentName, pageName) => {
    // This function will be passed down to child components
    console.log(`Implementing ${componentName} on the ${pageName} page`);
    // Here we'll add the logic to actually implement the component
    // For now, let's just show an alert
    alert(`Component ${componentName} has been added to ${pageName} page!`);
    // In a real implementation, you'd update the state or dispatch an action to add the component to the page
  };

  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const { error } = await login(email, password);
        if (error) throw error;
      } catch (error) {
        console.error('Error logging in:', error.message);
      }
    };

    return (
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    );
  };

  const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
      e.preventDefault();
      // Implement registration logic here
      console.log('Register with:', email, password);
    };

    return (
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Register</Button>
      </form>
    );
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
          className="fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col z-50"
          style={{ width: `${panelWidth}px` }}
        >
          <div
            ref={resizeHandleRef}
            className="absolute inset-y-0 left-0 w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400 z-50"
            onMouseDown={handleResizeMouseDown}
          />
          <div className="p-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h3 className="text-lg font-semibold">UI Components</h3>
                <p className="text-sm font-light italic -mt-1">by Marcio Pavão</p>
              </div>
              <div className="flex items-center">
                {session && (
                  <>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 transition-colors mr-2"
                    >
                      <LogOut size={20} />
                    </button>
                    <button
                      onClick={handleSettingsClick}
                      className="text-gray-500 hover:text-gray-700 transition-colors mr-2"
                    >
                      <Settings size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {!session ? (
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">Welcome to ShopPlugin</h2>
                {isRegistering ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
                    <RegisterForm />
                    <p className="mt-4 text-sm">
                      Already have an account?{' '}
                      <button
                        onClick={() => setIsRegistering(false)}
                        className="text-blue-500 hover:underline"
                      >
                        Login
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Login to Your Account</h3>
                    <LoginForm />
                    <p className="mt-4 text-sm">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Register
                      </button>
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Select a category</h4>
                <div className="relative" ref={dropdownRef}>
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
            )}
          </div>
          <div className="flex-grow overflow-y-auto">
            {session && (
              <div className="h-full">
                <ComponentesUI 
                  panelWidth={panelWidth} 
                  selectedCategory={selectedCategory} 
                  isEditMode={isEditMode} 
                  onComponentClick={handleComponentClick}
                  onImplementComponent={implementComponent}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmImplementation}
        componentName={selectedComponent}
        pageName={location.pathname.slice(1) || 'index'}
      />
    </>
  );
};

export default UIComponentsPanel;