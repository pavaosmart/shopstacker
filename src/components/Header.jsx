import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";

const Header = () => {
  const { session, logout } = useSupabaseAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex justify-between items-center">
          <li>
            <Link to="/" className="text-lg font-semibold">MyShopTools</Link>
          </li>
          <li className="flex space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            <Link to="/activity-logs" className="text-gray-600 hover:text-gray-900">Activity Logs</Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-900">Users</Link>
          </li>
          <li>
            {session ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;