import React, { useEffect, useState } from 'react';
import { paymentsAPI } from '@/lib/dashboard-api';
import { AlertCircle, Download, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { ListLoadingState } from '@/components/skeleton-loaders';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { formatDate } from 'date-fns';
import { formatCurrency } from '@/utils/formatCurrency';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await paymentsAPI.getAll();
        setPayments(data.data || []);
      } catch (err) {
        const message = handleError(err, { title: 'Failed to load payments' });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [handleError]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Pending':
        return <Clock className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-600 mt-1">View invoices and payment history</p>
        </div>
        <ListLoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-600 mt-1">Track invoices and payment status</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Failed to load payments</h3>
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

      {payments.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <CreditCard className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No payments yet</h3>
          <p className="text-slate-600">Payment information will appear here once your projects are processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CreditCard size={18} className="text-slate-400" />
                    Invoice {payment.invoiceNumber}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {payment.projectId?.title || 'Project'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(payment.amount || 0)}
                  </p>
                  <span
                    className={`inline-flex items-center space-x-1 mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {getStatusIcon(payment.status)}
                    <span>{payment.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-600">Issued</span>
                  <p className="font-medium text-slate-900 mt-1">
                    {formatDate(new Date(payment.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                {payment.dueDate && (
                  <div>
                    <span className="text-xs text-slate-600">Due</span>
                    <p className="font-medium text-slate-900 mt-1">
                      {formatDate(new Date(payment.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                {payment.paidDate && (
                  <div>
                    <span className="text-xs text-slate-600">Paid</span>
                    <p className="font-medium text-green-600 mt-1">
                      {formatDate(new Date(payment.paidDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {payment.description && <p>{payment.description}</p>}
                </div>
                <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors">
                  <Download size={16} />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
