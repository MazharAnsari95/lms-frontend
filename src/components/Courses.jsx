import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, BookOpen, IndianRupee, Layers } from 'lucide-react';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const navigate = useNavigate();

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  const getCourses = () => {
    setIsLoading(true);
    api.get('/course/all-courses', { params })
      .then((res) => {
        setCourseList(res.data.courses || res.data.Courses || []);
        setMeta(res.data.meta || null);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(getCourses, 300);
    return () => clearTimeout(t);
  }, [params]);

  // Motion Variants for Staggered Animation
  const containerVars = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  const cardVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="min-h-screen space-y-8 p-4 pb-12 lg:p-8">
      
      {/* --- PREMIUM TOOLBAR --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:bg-white/5 lg:p-4 lg:rounded-3xl lg:backdrop-blur-md lg:border lg:border-white/10">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by course name, mentor, or technology..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <SlidersHorizontal size={16} className="text-violet-400" />
            <select
              className="bg-transparent text-sm font-medium text-slate-200 outline-none cursor-pointer"
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
            >
              {[8, 12, 16, 24].map(val => <option key={val} value={val} className="bg-slate-900">{val} per page</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(limit)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courseList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="bg-white/5 p-6 rounded-full mb-4">
            <Layers size={48} className="text-slate-700" />
          </div>
          <h3 className="text-xl font-semibold text-white">No courses found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search filters.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode='popLayout'>
            {courseList.map((course) => (
              <motion.div
                key={course._id}
                variants={cardVars}
                layout
                onClick={() => navigate('/dashboard/course-detail/' + course._id)}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:border-violet-500/50 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    alt="thumbnail" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={course.imageUrl} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  
                  {/* Category/Price Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                      <IndianRupee size={12} /> {course.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Premium Course</span>
                    <BookOpen size={14} className="text-slate-500" />
                  </div>
                  <h2 className="text-lg font-bold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
                    {course.courseName}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description || "Master this subject with industry experts and hands-on projects."}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <div className="flex -space-x-2">
                       {/* Mock student avatars for "Social Proof" */}
                       {[1,2,3].map(i => (
                         <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-white">U{i}</div>
                       ))}
                    </div>
                    <span className="text-xs font-medium text-slate-500">Enrolling Now</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- FOOTER / PAGINATION --- */}
      <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

// Sleek Skeleton Loader
const SkeletonCard = () => (
  <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
    <div className="aspect-video bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-1/3 bg-white/5 rounded" />
      <div className="h-5 w-3/4 bg-white/5 rounded" />
      <div className="h-10 w-full bg-white/5 rounded" />
    </div>
  </div>
);

export default Courses;