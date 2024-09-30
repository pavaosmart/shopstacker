import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Bell,
  Settings,
  HelpCircle,
  FileText,
  User,
  Activity,
  Store
} from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Activity Logs', href: '/activity-logs', icon: Activity },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'API', href: '/api', icon: FileText },
  { name: 'API Store', href: '/api-store', icon: Store },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Profile', href: '/profile', icon: User },
];