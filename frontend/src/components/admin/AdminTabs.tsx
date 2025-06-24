
import React from 'react';
import { TrendingUp, Calendar, Package, Users } from 'lucide-react';

type TabType = 'overview' | 'appointments' | 'products' | 'users';

interface TabItem {
  id: TabType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: TabItem[] = [
    { id: 'overview', name: 'Resumen', icon: TrendingUp },
    { id: 'appointments', name: 'Citas', icon: Calendar },
    { id: 'products', name: 'Productos', icon: Package },
    { id: 'users', name: 'Clientes', icon: Users }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminTabs;
