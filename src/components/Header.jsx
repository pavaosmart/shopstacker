import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Header = () => {
  const { logout } = useSupabaseAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex justify-between items-center">
          <li>
            <Link to="/" className="text-lg font-semibold text-gray-800">ShopTools</Link>
          </li>
          <li className="flex space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">Produtos</Link>
            <Link to="/activity-logs" className="text-gray-600 hover:text-gray-900">Activity</Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-900">Usuários</Link>
          </li>
          <li>
            <button onClick={logout} className="text-gray-600 hover:text-gray-900">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;