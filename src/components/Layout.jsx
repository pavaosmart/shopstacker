import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SimpleSidebar from './SimpleSidebar';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <SimpleSidebar />
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;