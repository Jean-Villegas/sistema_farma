import { usePagination } from '../hooks/usePagination';

export default function DataTable({ columns, data, onEdit, onDelete, onView, searchable = true, pageSize = 10 }) {
  const { pageItems, currentPage, totalPages, totalItems, goToPage, nextPage, prevPage, search, searchTerm } = usePagination(data, pageSize);

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            className="input pl-9"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => search(e.target.value)}
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left p-3 font-semibold text-slate-600 whitespace-nowrap" style={col.width ? { width: col.width } : {}}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || onView) && <th className="text-left p-3 font-semibold text-slate-600 w-24">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">No hay datos disponibles</td></tr>
            ) : (
              pageItems.map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 text-slate-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '--'}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="p-3">
                      <div className="flex gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="btn btn-sm bg-sky-50 text-sky-600 hover:bg-sky-100"
                            title="Revisar y diagnosticar"
                          >
                            <i className="fas fa-stethoscope" />
                          </button>
                        )}
                        {onEdit && <button onClick={() => onEdit(row)} className="btn btn-sm bg-amber-50 text-amber-600 hover:bg-amber-100"><i className="fas fa-edit" /></button>}
                        {onDelete && <button onClick={() => onDelete(row)} className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100"><i className="fas fa-trash" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>{totalItems} registro{totalItems !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-sm bg-slate-100 disabled:opacity-30"><i className="fas fa-chevron-left" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => goToPage(p)} className={`btn btn-sm ${p === currentPage ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}</button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages} className="btn btn-sm bg-slate-100 disabled:opacity-30"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
