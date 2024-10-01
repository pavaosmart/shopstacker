import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Navigation = () => {
  const { session, logout } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
        {session && (
          <>
            <li><Link to="/api" className="hover:text-gray-300">API Config</Link></li>
            <li><Link to="/notifications" className="hover:text-gray-300">Notifications</Link></li>
            <li><button onClick={logout} className="hover:text-gray-300">Logout</button></li>
          </>
        )}
        {!session && (
          <>
            <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
            <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;