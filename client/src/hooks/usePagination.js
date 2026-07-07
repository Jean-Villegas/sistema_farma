import { useState, useMemo, useCallback } from 'react';

export function usePagination(items = [], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [items, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(safePage + 1), [goToPage, safePage]);
  const prevPage = useCallback(() => goToPage(safePage - 1), [goToPage, safePage]);

  const search = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safePage,
    totalPages,
    pageItems,
    filtered,
    totalItems: filtered.length,
    goToPage,
    nextPage,
    prevPage,
    search,
    searchTerm,
    setPageSize: () => {},
  };
}
