import React from 'react';
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  Clock, 
  BarChart3, 
  LogOut,
  School
} from 'lucide-react';
import { setCurrentUser } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const handleLogout = () => {
    setCurrentUser(null);
    window.location.reload();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'results', label: 'Results', icon: GraduationCap },
    { id: 'timetable', label: 'Timetable', icon: Clock },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-green-800 text-white w-64 flex flex-col">
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <School className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">MINDSET LABS</h1>
              <p className="text-green-200 text-sm">Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-700 text-white'
                        : 'text-green-100 hover:bg-green-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-green-100 hover:bg-green-700 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeTab}
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-KE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;