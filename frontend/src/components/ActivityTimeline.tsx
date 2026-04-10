import React, { useEffect, useState } from 'react';
import { activityAPI } from '@/lib/dashboard-api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  CheckCircle,
  MessageSquare,
  Zap,
  CreditCard,
  FolderPlus,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  _id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  projectId?: {
    _id: string;
    title: string;
  };
}

const getActivityIcon = (type: string) => {
  const iconClass = 'w-4 h-4';
  switch (type) {
    case 'project_created':
      return <FolderPlus className={`${iconClass} text-blue-600`} />;
    case 'milestone_completed':
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case 'message_sent':
      return <MessageSquare className={`${iconClass} text-purple-600`} />;
    case 'payment_received':
      return <CreditCard className={`${iconClass} text-emerald-600`} />;
    case 'payment_pending':
      return <Zap className={`${iconClass} text-amber-600`} />;
    default:
      return <Zap className={`${iconClass} text-slate-600`} />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'project_created':
      return 'bg-blue-50 border-l-4 border-l-blue-600';
    case 'milestone_completed':
      return 'bg-green-50 border-l-4 border-l-green-600';
    case 'message_sent':
      return 'bg-purple-50 border-l-4 border-l-purple-600';
    case 'payment_received':
      return 'bg-emerald-50 border-l-4 border-l-emerald-600';
    case 'payment_pending':
      return 'bg-amber-50 border-l-4 border-l-amber-600';
    default:
      return 'bg-slate-50 border-l-4 border-l-slate-600';
  }
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await activityAPI.getAll(10);
        setActivities(data.data || []);
        setError(null);
      } catch (err) {
        const message = handleError(err, { 
          title: 'Failed to load activity',
          showDetails: false 
        });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [handleError]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <p className="text-slate-500 text-sm text-center py-8">
          {error ? 'Unable to load activity' : 'No recent activity'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className={`p-4 rounded-lg transition-colors hover:bg-opacity-75 cursor-pointer ${getActivityColor(activity.type)}`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {activity.title}
                </p>
                {activity.projectId && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Project: <span className="font-medium">{activity.projectId.title}</span>
                  </p>
                )}
                {activity.description && (
                  <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
