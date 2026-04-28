import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const safePage = clamp(page || 1, 1, safeTotalPages);
  const pageItems = getPages(safePage, safeTotalPages);

  const go = (p) => {
    if (p !== safePage) onPageChange(clamp(p, 1, safeTotalPages));
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* --- INFO TEXT --- */}
      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
        Page <span className="text-white">{safePage}</span> of <span className="text-white">{safeTotalPages}</span>
      </p>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* --- FIRST / PREV --- */}
        <div className="flex items-center mr-2">
          <PaginationIconBtn 
            onClick={() => go(1)} 
            disabled={safePage <= 1} 
            icon={<ChevronsLeft size={18} />} 
          />
          <PaginationIconBtn 
            onClick={() => go(safePage - 1)} 
            disabled={safePage <= 1} 
            icon={<ChevronLeft size={18} />} 
          />
        </div>

        {/* --- PAGE NUMBERS --- */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pageItems.map((p, idx) =>
            p === '…' ? (
              <span key={`dots-${idx}`} className="px-2 text-slate-600 font-bold">···</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => go(p)}
                className={`
                  h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-sm font-bold transition-all duration-200
                  ${p === safePage 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 ring-2 ring-violet-400/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}
                `}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* --- NEXT / LAST --- */}
        <div className="flex items-center ml-2">
          <PaginationIconBtn 
            onClick={() => go(safePage + 1)} 
            disabled={safePage >= safeTotalPages} 
            icon={<ChevronRight size={18} />} 
          />
          <PaginationIconBtn 
            onClick={() => go(safeTotalPages)} 
            disabled={safePage >= safeTotalPages} 
            icon={<ChevronsRight size={18} />} 
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Icon Button Component
const PaginationIconBtn = ({ onClick, disabled, icon }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`
      p-2 sm:p-2.5 rounded-xl transition-all duration-200
      ${disabled 
        ? 'text-slate-700 cursor-not-allowed opacity-50' 
        : 'text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 active:scale-90'}
    `}
  >
    {icon}
  </button>
);