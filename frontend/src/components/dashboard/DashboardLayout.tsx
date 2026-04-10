import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  BarChart3,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/dashboard/projects', label: 'My Projects', icon: FolderOpen },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen shadow-xl`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className={`${!sidebarOpen && 'hidden'} font-bold text-lg`}>
            Devnexus
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-2 bg-slate-800 rounded-lg text-xs">
              <div className="text-slate-400">Logged in as:</div>
              <div className="font-semibold truncate">{user?.name || 'User'}</div>
            </div>
          )}
          <button
            onClick={() => logout(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`${
          sidebarOpen ? 'ml-64' : 'ml-20'
        } flex-1 overflow-auto transition-all duration-300`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome back, {user?.name}</p>
          </div>
          <div className="text-right text-sm text-slate-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
