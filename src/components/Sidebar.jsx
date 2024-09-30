import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Activity, 
  Users, 
  Settings, 
  LogOut,
  MessageSquare,
  Cpu,
  ShoppingCart,
  Bell,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Store
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useSupabaseAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
    { icon: <Package size={20} />, label: 'Produtos', to: '/products' },
    { icon: <ShoppingCart size={20} />, label: 'Pedidos', to: '/orders' },
    { icon: <Activity size={20} />, label: 'Atividade', to: '/activity-logs' },
    { icon: <Users size={20} />, label: 'Usuários', to: '/users' },
    { icon: <Bell size={20} />, label: 'Notificações', to: '/notifications' },
    { icon: <MessageSquare size={20} />, label: 'Suporte', to: '/support' },
    { icon: <HelpCircle size={20} />, label: 'Ajuda', to: '/help' },
    { icon: <Cpu size={20} />, label: 'API', to: '/api' },
    { icon: <Store size={20} />, label: 'Mercado APIs', to: '/api-store' },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isExpanded ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300`}>
      <div className="flex justify-between items-center mb-8">
        {isExpanded && <div className="text-2xl font-bold">ShopTools</div>}
        <Button onClick={toggleSidebar} variant="ghost" size="sm" className="text-white">
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.to} 
                className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} p-2 rounded
                  ${location.pathname === item.to ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
              >
                {item.icon}
                {isExpanded && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4">
        <Button onClick={logout} variant="ghost" className={`w-full text-white hover:text-gray-300 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <LogOut className="h-4 w-4" />
          {isExpanded && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;