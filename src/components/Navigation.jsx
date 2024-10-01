import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, Activity, Users, Bell, Settings, HelpCircle, Store } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Produtos' },
    { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
    { to: '/activity-logs', icon: Activity, label: 'Logs de Atividade' },
    { to: '/users', icon: Users, label: 'Usuários' },
    { to: '/notifications', icon: Bell, label: 'Notificações' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
    { to: '/help', icon: HelpCircle, label: 'Ajuda' },
    { to: '/market', icon: Store, label: 'Mercado' }, // Novo item de navegação para a página Market
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;