import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  LayoutGrid, 
  List, 
  Phone, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  MoreVertical,
  Filter
} from 'lucide-react';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const Students = () => {
  const [studentList, setStudentList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(true);
      api.get('/student/all-student', { params })
        .then((res) => {
          setStudentList(res.data.studentList || []);
          setMeta(res.data.meta || null);
        })
        .catch((err) => toast.error(getErrorMessage(err)))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-lg"><Users size={24} /></div>
            Student Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Total Enrolled: {meta?.totalDocs || 0} students</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

          <select
            className="bg-slate-950 border border-white/10 text-slate-300 text-sm rounded-xl px-4 py-2 outline-none focus:border-violet-500 cursor-pointer"
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
          >
            {[10, 20, 50].map(v => <option key={v} value={v}>{v} / page</option>)}
          </select>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={20} />
        <input
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:bg-black focus:border-violet-500/50 outline-none transition-all shadow-inner"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search students by name, email, or mobile..."
        />
      </div>

      {/* --- DATA VIEW --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : studentList.length === 0 ? (
        <div className="py-40 text-center rounded-[3rem] border border-dashed border-white/10">
          <Filter size={48} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-white">No matches found</h3>
          <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div 
                key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20"
              >
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-5">Profile</th>
                      <th className="px-6 py-5">Contact Details</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {studentList.map((student) => (
                      <tr 
                        key={student._id} 
                        className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                        onClick={() => navigate('/dashboard/student-detail/' + student._id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-violet-500 transition-all" src={student.imageUrl} alt="" />
                            <div>
                              <p className="text-sm font-bold text-white uppercase tracking-tight">{student.fullName}</p>
                              <p className="text-[10px] text-slate-500 font-mono italic">Ref: {student._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-300"><Mail size={12} className="text-violet-500" /> {student.email}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-300"><Phone size={12} className="text-emerald-500" /> {student.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">ACTIVE</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 rounded-xl bg-white/5 text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-lg">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {studentList.map((student) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={student._id}
                    onClick={() => navigate('/dashboard/student-detail/' + student._id)}
                    className="group bg-black/40 border border-white/10 rounded-[2.5rem] p-6 hover:border-violet-500/50 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-violet-400" />
                    </div>
                    <img className="h-20 w-20 rounded-2xl object-cover mb-4 ring-2 ring-white/5" src={student.imageUrl} alt="" />
                    <h3 className="text-white font-bold uppercase text-sm tracking-wide mb-1 group-hover:text-violet-400 transition-colors">{student.fullName}</h3>
                    <p className="text-xs text-slate-500 mb-4 break-all truncate">{student.email}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Phone size={12} /> {student.phone.slice(0, 5)}...
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">{student._id.slice(-6)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default Students;