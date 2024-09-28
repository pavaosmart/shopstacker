import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebars from './ui-catalog/Sidebars';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebars />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;