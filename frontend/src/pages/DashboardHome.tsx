import React, { useEffect, useState } from 'react';
import { projectsAPI, paymentsAPI } from '@/lib/dashboard-api';
import { AlertCircle, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { DashboardLoadingState } from '@/components/skeleton-loaders';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import ActivityTimeline from '@/components/ActivityTimeline';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projects: { total: 0, inProgress: 0, completed: 0, pending: 0 },
    payments: { totalPaid: 0, totalPending: 0, totalAmount: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectStats = await projectsAPI.getStats();
        const paymentStats = await paymentsAPI.getStats();
        setStats({
          projects: projectStats.stats,
          payments: paymentStats.stats,
        });
      } catch (err) {
        const message = handleError(err, { title: 'Failed to load dashboard' });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [handleError]);

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-4 max-w-2xl mx-auto mt-8">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-red-900">Failed to Load Dashboard</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color, subtext }: { icon: any; title: string; value: string | number; color: string; subtext?: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} opacity-10`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            title="Total Projects"
            value={stats.projects.total}
            color="text-blue-600"
            subtext="All time"
          />
          <StatCard
            icon={Clock}
            title="In Progress"
            value={stats.projects.inProgress}
            color="text-amber-600"
            subtext="Currently active"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={stats.projects.completed}
            color="text-green-600"
            subtext="Successfully delivered"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Revenue"
            value={formatCurrency(stats.payments.totalAmount || 0)}
            color="text-emerald-600"
            subtext={`Paid: ${formatCurrency(stats.payments.totalPaid || 0)}`}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/projects/new"
            className="group bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              Create New Project
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-indigo-100">Submit a new project request</p>
          </a>
          <a
            href="/dashboard/messages"
            className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              View Messages
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-blue-100">Check project updates and team communications</p>
          </a>
          <a
            href="/dashboard/payments"
            className="group bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              View Payments
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-emerald-100">Track invoices and payment status</p>
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Paid:</span>
              <span className="font-semibold text-green-600">{formatCurrency(stats.payments.totalPaid || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending:</span>
              <span className="font-semibold text-amber-600">{formatCurrency(stats.payments.totalPending || 0)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Total:</span>
              <span className="font-bold text-slate-900">{formatCurrency(stats.payments.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">Project Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending:</span>
              <span className="font-semibold text-slate-600">{stats.projects.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">In Progress:</span>
              <span className="font-semibold text-blue-600">{stats.projects.inProgress}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Completed:</span>
              <span className="font-bold text-green-600">{stats.projects.completed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline />
    </div>
  );
}
