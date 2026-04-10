import { useCallback } from 'react';
import toast from 'react-hot-toast';

interface ErrorOptions {
  title?: string;
  duration?: number;
  showDetails?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback(
    (error: unknown, options: ErrorOptions = {}) => {
      const {
        title = 'Error',
        duration = 4000,
        showDetails = false,
      } = options;

      let message = 'An unexpected error occurred';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = (error as any).message;
      }

      const isDev = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
      if (isDev) {
        console.error(`[${title}]`, error);
      }

      const displayMessage = showDetails ? message : title;
      toast.error(displayMessage, { duration });

      return message;
    },
    []
  );

  return { handleError };
};

export const useSuccessToast = () => {
  const showSuccess = useCallback((message: string, duration = 3000) => {
    toast.success(message, { duration });
  }, []);

  return { showSuccess };
};

export const useLoadingToast = () => {
  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const dismissLoading = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const updateLoading = useCallback((id: string, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message, { id });
    } else {
      toast.error(message, { id });
    }
  }, []);

  return { showLoading, dismissLoading, updateLoading };
};
