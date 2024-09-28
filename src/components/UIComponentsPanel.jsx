import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Settings, LogOut } from 'lucide-react';
import ComponentesUI from '../pages/ComponentesUI';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import PreviewCards from './ui-catalog/PreviewCards';

const UIComponentsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isEditMode, setIsEditMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPreviewCards, setShowPreviewCards] = useState(true);
  const panelRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const dropdownRef = useRef(null);

  const categories = [
    { id: '001', name: 'Dialog Confirmations' },
    { id: '002', name: 'Top Bars (Navigation Bars)' },
    { id: '003', name: 'Buttons' },
    { id: '004', name: 'Cards' },
    { id: '005', name: 'Dialogs/Modals' },
    { id: '006', name: 'Tables' },
    { id: '007', name: 'Forms' },
    { id: '008', name: 'Typography' },
    { id: '009', name: 'Icons and Illustrations' },
    { id: '010', name: 'Notifications and Toasts' }
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
    if (isLoggedIn) {
      setIsEditMode(!isEditMode);
      setSelectedCategory('');
      setShowPreviewCards(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Implementar lógica de login aqui
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowPreviewCards(false);
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
                {isLoggedIn && (
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
            {!isLoggedIn ? (
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                    <Link to="/forgot-password">Esqueceu a senha?</Link>
                  </div>
                  <Button type="submit" className="w-full bg-[#14161A] hover:bg-[#14161A]/90">
                    Entrar
                  </Button>
                  <div className="text-sm text-center">
                    Não tem uma conta? <Link to="/register" className="text-blue-500 hover:underline">Cadastre-se</Link>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full">
                {showPreviewCards ? (
                  <PreviewCards isEditMode={isEditMode} onCategorySelect={handleCategorySelect} />
                ) : (
                  <ComponentesUI panelWidth={panelWidth} selectedCategory={selectedCategory} isEditMode={isEditMode} />
                )}
              </div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto">
            {isLoggedIn && !showPreviewCards && (
              <div className="h-full">
                <ComponentesUI panelWidth={panelWidth} selectedCategory={selectedCategory} isEditMode={isEditMode} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UIComponentsPanel;