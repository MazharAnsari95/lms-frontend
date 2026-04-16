import React from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function getPages(current, total) {
  const pages = [];
  const add = (p) => pages.push(p);
  const addDots = () => pages.push('…');

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) add(i);
    return pages;
  }

  add(1);
  if (current > 3) addDots();

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i += 1) add(i);

  if (current < total - 2) addDots();
  add(total);
  return pages;
}

export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null;

  const { page, totalPages } = meta;
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const safePage = clamp(page || 1, 1, safeTotalPages);
  const pageItems = getPages(safePage, safeTotalPages);

  const go = (p) => onPageChange(clamp(p, 1, safeTotalPages));

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage <= 1}
        onClick={() => go(1)}
      >
        « First
      </button>
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage <= 1}
        onClick={() => go(safePage - 1)}
      >
        ‹ Prev
      </button>

      <div className="pagination-pages">
        {pageItems.map((p, idx) =>
          p === '…' ? (
            <span key={`dots-${idx}`} className="pagination-dots">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={p === safePage ? 'pagination-btn pagination-btn-active' : 'pagination-btn pagination-btn-page'}
              onClick={() => go(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination-btn"
        disabled={safePage >= safeTotalPages}
        onClick={() => go(safePage + 1)}
      >
        Next ›
      </button>
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage >= safeTotalPages}
        onClick={() => go(safeTotalPages)}
      >
        Last »
      </button>
    </div>
  );
}

