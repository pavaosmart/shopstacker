import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">ShopTools</h1>
          {/* Adicione aqui quaisquer elementos que você queira manter no cabeçalho */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
