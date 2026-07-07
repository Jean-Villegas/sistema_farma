import { useState, useEffect } from 'react';

export default function Alert({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message) {
      const timer = setTimeout(() => { setVisible(false); if (onClose) onClose(); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-sky-50 border-sky-200 text-sky-700',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 animate-slide-down ${colors[type] || colors.info}`}>
      <i className={`fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'info' ? 'info-circle' : 'exclamation-circle'}`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={() => { setVisible(false); if (onClose) onClose(); }} className="text-current opacity-50 hover:opacity-100"><i className="fas fa-times" /></button>
    </div>
  );
}
