import { createContext, useContext, useCallback, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'info' });
  const timerRef = useRef(null);

  const mostrarToast = useCallback((mensaje, tipo = 'info') => {
    clearTimeout(timerRef.current);
    setToast({ visible: true, mensaje, tipo });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className={`toast ${toast.visible ? 'show' : ''} ${toast.tipo === 'error' ? 'error' : ''}`}>
        {toast.mensaje}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
