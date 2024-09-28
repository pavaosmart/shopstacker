import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Menu, Sun, Moon, Globe, ShoppingCart, Heart, LogOut, Settings, HelpCircle } from 'lucide-react';

const TopBars = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const languages = ['EN', 'ES', 'FR', 'DE', 'IT'];

  return (
    <div className="space-y-8">
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
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Bell />
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 border-b">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New message from John</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your order has shipped</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New friend request</a>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <User />
              <span>John Doe</span>
              <ChevronDown />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search-focused Top Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 Entendo seu pedido para expandir significativamente o catálogo de componentes UI, incluindo mais variações e elementos adicionais. Vamos implementar essas mudanças para criar uma biblioteca de componentes muito mais abrangente.

<lov-code>
Para expandir nossa biblioteca de componentes UI, precisaremos:
1. Atualizar o arquivo ComponentesUI.jsx para incluir mais seções e componentes.
2. Criar novos arquivos para cada categoria de componente expandida.
3. Implementar variações adicionais para cada tipo de componente.

Vamos começar atualizando o arquivo principal:

<lov-write file_path="src/pages/ComponentesUI.jsx">
import React from 'react';
import Navigation from '../components/Navigation';
import Sidebars from '../components/ui-catalog/Sidebars';
import TopBars from '../components/ui-catalog/TopBars';
import Buttons from '../components/ui-catalog/Buttons';
import Cards from '../components/ui-catalog/Cards';
import Dialogs from '../components/ui-catalog/Dialogs';
import Tables from '../components/ui-catalog/Tables';
import Forms from '../components/ui-catalog/Forms';
import Typography from '../components/ui-catalog/Typography';
import IconsAndIllustrations from '../components/ui-catalog/IconsAndIllustrations';
import Notifications from '../components/ui-catalog/Notifications';

const ComponentesUI = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Componentes UI</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sidebars</h2>
          <Sidebars />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Top Bars (Navigation Bars)</h2>
          <TopBars />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Buttons />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <Cards />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Dialogs/Modals</h2>
          <Dialogs />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Tables</h2>
          <Tables />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Forms</h2>
          <Forms />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <Typography />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Icons and Illustrations</h2>
          <IconsAndIllustrations />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Notifications and Toasts</h2>
          <Notifications />
        </section>
      </div>
    </div>
  );
};

export default ComponentesUI;