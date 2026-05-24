import { createContext, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const ToastContext = createContext(null);

const iconByVariant = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(
    () => ({
      pushToast: ({ title, message, variant = 'info' }) => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, title, message, variant }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3500);
      },
      success: (title, message) => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, title, message, variant: 'success' }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3500);
      },
      error: (title, message) => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, title, message, variant: 'error' }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 4000);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = iconByVariant[toast.variant] ?? Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                className={cn(
                  'pointer-events-auto rounded-2xl border p-4 shadow-glass backdrop-blur-2xl',
                  'border-white/10 bg-slate-950/90 text-slate-100 dark:bg-slate-950/90',
                  toast.variant === 'success' && 'border-emerald-400/30',
                  toast.variant === 'error' && 'border-rose-400/30',
                  toast.variant === 'info' && 'border-sky-400/30',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-white/10 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{toast.title}</p>
                    {toast.message ? (
                      <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setToasts((current) => current.filter((item) => item.id !== toast.id))
                    }
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

