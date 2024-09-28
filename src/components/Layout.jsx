import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Header from './Header';
import Sidebars from './ui-catalog/Sidebars';
import UIComponentsPanel from './UIComponentsPanel';

const Layout = () => {
  return (
    <ThemeProvider attribute="class">
      <div className="flex h-screen overflow-hidden">
        <Sidebars />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
        <UIComponentsPanel />
      </div>
    </ThemeProvider>
  );
};

export default Layout;