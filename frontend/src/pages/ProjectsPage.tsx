import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '@/lib/dashboard-api';
import { AlertCircle, Plus, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { ListLoadingState } from '@/components/skeleton-loaders';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useSuccessToast } from '@/hooks/useErrorHandler';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useSuccessToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsAPI.getAll();
        setProjects(data.data || []);
      } catch (err) {
        const message = handleError(err, { title: 'Failed to load projects' });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [handleError]);

  // Calculate progress from milestones
  const calculateProgress = (milestones: any[]) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        setDeleting(projectId);
        await projectsAPI.delete(projectId);
        setProjects(projects.filter((p: any) => p._id !== projectId));
        showSuccess('Project deleted successfully');
      } catch (err) {
        handleError(err, { title: 'Failed to delete project' });
      } finally {
        setDeleting(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-600 mt-1">Manage your projects and track progress</p>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>
        <ListLoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-600 mt-1">Manage your projects and track progress</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/projects/new')}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Failed to load projects</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <TrendingUp className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-6">Create your first project to get started</p>
          <button
            onClick={() => navigate('/dashboard/projects/new')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => {
            const progress = calculateProgress(project.milestones);
            return (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">Progress</span>
                      <span className="text-xs font-semibold text-slate-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Deadline and Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                    {project.deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.budget && (
                      <span className="font-semibold text-slate-900">{formatCurrency(project.budget || 0)}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                      className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deleting === project._id}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>{deleting === project._id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
