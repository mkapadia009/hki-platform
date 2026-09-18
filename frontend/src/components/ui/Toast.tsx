'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 min-w-[300px] rounded-lg shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100' :
              'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/90 dark:border-blue-800 dark:text-blue-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
              {toast.type === 'error' && <XCircle size={20} className="text-red-600 dark:text-red-400" />}
              {toast.type === 'info' && <Info size={20} className="text-blue-600 dark:text-blue-400" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
