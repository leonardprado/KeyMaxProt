
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Store, Users, Wrench, Newspaper } from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Resumen', icon: LayoutDashboard, path: '/admin' },
    { name: 'Talleres', icon: Store, path: '/admin/shops' },
    { name: 'Productos', icon: ShoppingCart, path: '/admin/products' },
    { name: 'Servicios', icon: Wrench, path: '/admin/services' },
    { name: 'Usuarios', icon: Users, path: '/admin/users' },
    { name: 'Blog', icon: Newspaper, path: '/admin/blog' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-2 rounded-md transition-colors duration-200
              ${location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin')
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
