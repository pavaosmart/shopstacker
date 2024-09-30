import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  Activity, 
  Users, 
  Settings, 
  PlusCircle, 
  LogOut,
  MessageSquare,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useSupabaseAuth();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">ShopTools</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Package size={20} />
              <span>Produtos</span>
            </Link>
          </li>
          <li>
            <Link to="/activity-logs" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Activity size={20} />
              <span>Atividade</span>
            </Link>
          </li>
          <li>
            <Link to="/users" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Users size={20} />
              <span>Usuários</span>
            </Link>
          </li>
          <li>
            <Link to="/support" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <MessageSquare size={20} />
              <span>Suporte</span>
            </Link>
          </li>
          <li>
            <Link to="/api-settings" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Cpu size={20} />
              <span>Configurações de API</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4">
        <Button onClick={logout} variant="ghost" className="w-full text-white hover:text-gray-300 justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;