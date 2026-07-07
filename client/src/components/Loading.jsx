export default function Loading({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <i className="fas fa-spinner fa-spin text-2xl mb-3 text-sky-500" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
