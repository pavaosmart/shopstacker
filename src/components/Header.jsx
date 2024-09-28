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
          <li>
            <Link to="/dashboard" className="mr-4">Dashboard</Link>
            <Link to="/componentes-ui" className="mr-4">Componentes UI</Link>
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