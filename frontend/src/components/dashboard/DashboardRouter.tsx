import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHome from '@/pages/DashboardHome';
import ProjectsPage from '@/pages/ProjectsPage';
import MessagesPage from '@/pages/MessagesPage';
import PaymentsPage from '@/pages/PaymentsPage';
import SettingsPage from '@/pages/SettingsPage';
import CreateProjectPage from '@/pages/CreateProjectPage';

export default function DashboardRouter() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/projects/:projectId" element={<ProjectsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:projectId" element={<MessagesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
