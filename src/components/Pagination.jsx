import React from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null;

  const { page, totalPages } = meta;
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const safePage = clamp(page || 1, 1, safeTotalPages);

  const go = (p) => onPageChange(clamp(p, 1, safeTotalPages));

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage <= 1}
        onClick={() => go(1)}
      >
        First
      </button>
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage <= 1}
        onClick={() => go(safePage - 1)}
      >
        Prev
      </button>

      <div className="pagination-info">
        Page <b>{safePage}</b> / {safeTotalPages}
      </div>

      <button
        type="button"
        className="pagination-btn"
        disabled={safePage >= safeTotalPages}
        onClick={() => go(safePage + 1)}
      >
        Next
      </button>
      <button
        type="button"
        className="pagination-btn"
        disabled={safePage >= safeTotalPages}
        onClick={() => go(safeTotalPages)}
      >
        Last
      </button>
    </div>
  );
}

