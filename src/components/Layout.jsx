import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [sidebar, setSidebar] = useState(null);
  const [topbar, setTopbar] = useState(null);

  // Esta função será chamada pelo UIComponentsPanel quando um componente for confirmado
  const implementComponent = (componentType, component) => {
    if (componentType === 'sidebar') {
      setSidebar(component);
    } else if (componentType === 'topbar') {
      setTopbar(component);
    }
  };

  return (
    <div className="flex h-screen">
      {sidebar && <div className="w-64">{sidebar}</div>}
      <div className="flex-1 flex flex-col">
        {topbar && <div>{topbar}</div>}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;