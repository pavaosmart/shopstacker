import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { logout } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
        <li><Link to="/products" className="hover:text-gray-300">Products</Link></li>
        <li><Link to="/activity-logs" className="hover:text-gray-300">Activity Logs</Link></li>
        <li><Link to="/users" className="hover:text-gray-300">Users</Link></li>
        <li><Link to="/settings" className="hover:text-gray-300">Settings</Link></li>
        <li><Link to="/create-bot" className="hover:text-gray-300">Create Bot</Link></li>
        <li>
          <Button onClick={logout} variant="ghost" className="hover:text-gray-300">
            Logout
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;