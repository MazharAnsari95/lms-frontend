import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserCircle, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  ChevronRight, 
  Users,
  LayoutGrid,
  List
} from 'lucide-react';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const Students = () => {
  const [studentList, setStudentList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    }, 250);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <div className="min-h-screen space-y-6 p-4 lg:p-8">
      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-violet-500" /> Student Directory
          </h1>
          <p className="text-sm text-slate-400">Manage and monitor all enrolled students across courses.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Students</p>
            <p className="text-xl font-bold text-white">{meta?.totalDocs || studentList.length}</p>
          </div>
        </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 transition-all outline-none"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by name, email or phone..."
          />
        </div>
        
        <select
          className="h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none cursor-pointer focus:border-violet-500"
          value={limit}
          onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
        >
          {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v} per page</option>)}
        </select>
      </div>

      {/* --- LOADING / EMPTY STATE --- */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-slate-500 animate-pulse">Fetching records...</p>
        </div>
      ) : studentList.length === 0 ? (
        <div className="py-32 text-center rounded-3xl border border-dashed border-white/10">
          <UserCircle size={48} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-white font-medium">No students found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query.</p>
        </div>
      ) : (
        <>
          {/* --- DESKTOP TABLE VIEW --- */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 text-center w-20">Photo</th>
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {studentList.map((student) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={student._id}
                    onClick={() => navigate('/dashboard/student-detail/' + student._id)}
                    className="group cursor-pointer hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-violet-500/50 transition-all mx-auto"
                        src={student.imageUrl}
                        alt="student profile"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white group-hover:text-violet-400 transition-colors uppercase text-sm tracking-wide">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-slate-500">ID: {student._id.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail size={12} className="text-slate-500" /> {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone size={12} className="text-slate-500" /> {student.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARD VIEW --- */}
          <div className="lg:hidden grid gap-4">
            {studentList.map((student) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={student._id}
                onClick={() => navigate('/dashboard/student-detail/' + student._id)}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-all"
              >
                <img className="h-16 w-16 rounded-2xl object-cover" src={student.imageUrl} alt="student" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate uppercase text-sm tracking-wide">{student.fullName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <Mail size={10} /> {student.email}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Ref: {student._id.slice(-8)}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </motion.div>
            ))}
          </div>

          {/* --- PAGINATION --- */}
          <div className="pt-6 border-t border-white/5">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default Students;