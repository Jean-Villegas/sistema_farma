export default function Modal({ isOpen, onClose, title, children, size = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content w-full ${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
