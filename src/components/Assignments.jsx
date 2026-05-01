import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar, 
  BookOpen, 
  Paperclip, 
  Clock, 
  ChevronRight,
  ClipboardList,
  Filter,
  Loader2
} from 'lucide-react';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

export default function Assignments() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(true);
      api.get('/assignment', { params })
        .then((res) => {
          setItems(res.data.assignments || []);
          setMeta(res.data.meta || null);
        })
        .catch((err) => toast.error(getErrorMessage(err)))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-black/40 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/20">
              <ClipboardList size={28} />
            </div>
            Assignments
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-[0.2em] font-semibold">Academic Resource Hub</p>
        </div>

        <button 
          onClick={() => navigate('/dashboard/add-assignment')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
        >
          <Plus size={20} />
          Create New Task
        </button>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:bg-black focus:border-indigo-500/50 outline-none transition-all"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Filter by title or topic description..."
          />
        </div>

        <select
          className="h-14 bg-slate-950 border border-white/10 text-slate-300 text-sm rounded-2xl px-6 outline-none focus:border-indigo-500 transition-all cursor-pointer min-w-[140px]"
          value={limit}
          onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
        >
          {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v} Per Page</option>)}
        </select>
      </div>

      {/* --- CONTENT AREA --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02]">
          <Filter size={48} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-white">No assignments listed</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">Try a different search term or create a new assignment for your students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {items.map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                className="group bg-black/40 border border-white/10 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => navigate('/dashboard/assignment-detail/' + a._id)}
              >
                {/* Due Date Badge */}
                <div className="absolute top-0 right-0 p-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                    a.dueDate ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Clock size={12} />
                    {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'OPEN'}
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <BookOpen size={24} />
                    </div>
                    <div className="pr-20">
                      <h2 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                        {a.title}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">{a.courseId}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {a.description || 'No detailed instructions provided for this assignment.'}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      {a.attachmentUrl && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                          <Paperclip size={14} />
                          Resource Attached
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-indigo-400 text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                      Details <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- FOOTER --- */}
      <div className="flex justify-center pt-10">
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}