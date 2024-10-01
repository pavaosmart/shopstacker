import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Activity, 
  Users, 
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Store,
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useSupabaseAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const sidebarSections = [
    {
      title: 'Vendedor',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
        { icon: <Store size={20} />, label: 'Mercado', to: '/market' },
        { icon: <Package size={20} />, label: 'Meus Produtos', to: '/meus-produtos' },
        { icon: <ShoppingCart size={20} />, label: 'Pedidos', to: '/orders' },
      ]
    },
    {
      title: 'Fornecedor',
      items: [
        { icon: <Package size={20} />, label: 'Estoque', to: '/estoque' },
      ]
    },
    {
      title: 'Admin',
      items: [
        { icon: <Activity size={20} />, label: 'Atividades', to: '/activity-logs' },
        { icon: <Users size={20} />, label: 'Usuários', to: '/users' },
        { icon: <Bell size={20} />, label: 'Notificações', to: '/notifications' },
        { icon: <FileText size={20} />, label: 'Integrações', to: '/integrations' },
      ]
    }
  ];

  const footerItems = [
    { icon: <HelpCircle size={20} />, label: 'Suporte', to: '/support' },
    { icon: <LogOut size={20} />, label: 'Sair', onClick: logout },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isExpanded ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300 flex flex-col`}>
      <div className="flex justify-between items-center mb-8">
        {isExpanded && <div className="text-2xl font-bold">ShopTools</div>}
        <Button onClick={toggleSidebar} variant="ghost" size="sm" className="text-white">
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <nav className="flex-grow">
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {isExpanded && <h3 className="text-xs uppercase text-gray-400 mb-2">{section.title}</h3>}
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
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
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <ul className="space-y-2">
          {footerItems.map((item, index) => (
            <li key={index}>
              {item.to ? (
                <Link 
                  to={item.to}
                  className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} p-2 rounded hover:bg-gray-700`}
                >
                  {item.icon}
                  {isExpanded && <span>{item.label}</span>}
                </Link>
              ) : (
                <Button 
                  onClick={item.onClick} 
                  variant="ghost" 
                  className={`w-full text-white hover:text-gray-300 ${isExpanded ? 'justify-start' : 'justify-center'}`}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-2">{item.label}</span>}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;