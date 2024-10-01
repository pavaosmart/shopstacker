import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Store,
  Truck,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useSupabaseAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const sidebarItems = {
    vendedor: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
      { icon: <Store size={20} />, label: 'Mercado', to: '/market' },
      { icon: <Package size={20} />, label: 'Meus Produtos', to: '/meus-produtos' },
      { icon: <ShoppingCart size={20} />, label: 'Pedidos', to: '/orders' },
    ],
    fornecedor: [
      { icon: <Truck size={20} />, label: 'Fornecimento', to: '/fornecimento' },
      { icon: <Package size={20} />, label: 'Catálogo', to: '/catalogo' },
    ],
    admin: [
      { icon: <Users size={20} />, label: 'Usuários', to: '/users' },
      { icon: <Settings size={20} />, label: 'Configurações', to: '/settings' },
    ],
  };

  const renderSidebarSection = (section, items) => (
    <div key={section}>
      <h3 className={`text-sm font-semibold text-gray-400 uppercase mb-2 ${isExpanded ? '' : 'sr-only'}`}>{section}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
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
    </div>
  );

  return (
    <div className={`bg-gray-800 text-white ${isExpanded ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300`}>
      <div className="flex justify-between items-center mb-8">
        {isExpanded && <div className="text-2xl font-bold">ShopTools</div>}
        <Button onClick={toggleSidebar} variant="ghost" size="sm" className="text-white">
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <nav className="space-y-8">
        {renderSidebarSection('Vendedor', sidebarItems.vendedor)}
        {renderSidebarSection('Fornecedor', sidebarItems.fornecedor)}
        {renderSidebarSection('Admin', sidebarItems.admin)}
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