import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  FileCheck, 
  Download, 
  Calculator, 
  UserCircle,
  BookOpen,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const blankSubject = () => ({ name: '', maxMarks: 100, marks: 0 });

export default function Marksheet() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [examName, setExamName] = useState('');
  const [remark, setRemark] = useState('');
  const [subjects, setSubjects] = useState([blankSubject()]);
  const [savedMarksheets, setSavedMarksheets] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) setCourseId(list[0]._id);
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    if (!courseId) return;
    api.get(`/student/all-student/${courseId}`)
      .then((res) => {
        const list = res.data.studentList || [];
        setStudents(list);
        setStudentId(list[0]?._id || '');
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [courseId]);

  useEffect(() => {
    if (!studentId) {
      setSavedMarksheets([]);
      return;
    }
    api.get(`/marksheet/student/${studentId}`, { params: { courseId } })
      .then((res) => setSavedMarksheets(res.data.marksheets || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [studentId, courseId]);

  const totals = useMemo(() => {
    const total = subjects.reduce((sum, s) => sum + Number(s.marks || 0), 0);
    const max = subjects.reduce((sum, s) => sum + Number(s.maxMarks || 0), 0);
    const percent = max > 0 ? ((total / max) * 100).toFixed(2) : '0.00';
    return { total, max, percent };
  }, [subjects]);

  const updateSubject = (index, key, value) => {
    setSubjects((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const addSubject = () => setSubjects((prev) => [...prev, blankSubject()]);
  const removeSubject = (index) => setSubjects((prev) => prev.filter((_, i) => i !== index));

  const submit = (e) => {
    e.preventDefault();
    if (!courseId || !studentId || !examName.trim()) return toast.error('Select course, student and exam name');
    
    setIsSaving(true);
    api.post('/marksheet', {
      courseId, studentId, examName, remark,
      subjects: subjects.filter(s => s.name.trim()).map(s => ({
        name: s.name,
        maxMarks: Number(s.maxMarks),
        marks: Number(s.marks)
      }))
    })
      .then((res) => {
        toast.success('Marksheet generated successfully');
        setSavedMarksheets((prev) => [res.data.marksheet, ...prev]);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsSaving(false));
  };

  const openPdf = async (id) => {
    try {
      const res = await api.get(`/marksheet/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-amber-500 rounded-2xl shadow-xl shadow-amber-900/20 text-white">
          <GraduationCap size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Marksheet Generator</h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em] font-semibold">Results & Academic Assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* --- LEFT: GENERATOR FORM --- */}
        <div className="xl:col-span-8 space-y-6">
          <form onSubmit={submit} className="bg-black/40 border border-white/10 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-md shadow-2xl space-y-8">
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Course</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <select className="w-full h-12 pl-12 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 appearance-none" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                    {courses.map((c) => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Name</label>
                <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <select className="w-full h-12 pl-12 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 appearance-none" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                    {students.map((s) => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Examination Title</label>
                <input className="w-full h-12 px-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="e.g. Mid-Term 2024" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Remark</label>
                <input className="w-full h-12 px-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="e.g. Outstanding Performance" />
              </div>
            </div>

            {/* Subjects Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Calculator size={18} className="text-amber-500" />
                  Score Entry
                </h3>
                <button type="button" onClick={addSubject} className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-amber-400 transition-colors bg-amber-500/10 px-4 py-2 rounded-lg">
                  <Plus size={14} /> Add Subject
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {subjects.map((subject, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-12 gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all"
                    >
                      <div className="col-span-12 md:col-span-6">
                        <input className="w-full h-11 bg-slate-950 border border-white/5 rounded-xl px-4 text-white text-sm outline-none focus:border-amber-500/30" value={subject.name} onChange={(e) => updateSubject(index, 'name', e.target.value)} placeholder="Subject Name" />
                      </div>
                      <div className="col-span-5 md:col-span-2">
                        <input type="number" className="w-full h-11 bg-slate-950 border border-white/5 rounded-xl px-4 text-white text-sm text-center outline-none focus:border-amber-500/30" value={subject.maxMarks} onChange={(e) => updateSubject(index, 'maxMarks', e.target.value)} placeholder="Max" />
                      </div>
                      <div className="col-span-5 md:col-span-3">
                        <input type="number" className="w-full h-11 bg-slate-950 border border-white/5 rounded-xl px-4 text-white text-sm text-center outline-none focus:border-amber-500/30 font-bold" value={subject.marks} onChange={(e) => updateSubject(index, 'marks', e.target.value)} placeholder="Marks" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <button type="button" onClick={() => removeSubject(index)} className="w-full h-11 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50 active:scale-[0.98]">
              {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Calculator size={20} /></motion.div> : <FileCheck size={20} />}
              Generate Professional Marksheet
            </button>
          </form>
        </div>

        {/* --- RIGHT: REAL-TIME STATS & HISTORY --- */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Live Stats Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-slate-950 shadow-2xl relative overflow-hidden group">
            <Trophy className="absolute -right-4 -bottom-4 text-slate-950/10 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6">Current Performance</p>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-slate-950/10 pb-4">
                <span className="text-sm font-bold uppercase tracking-tighter">Aggregate</span>
                <span className="text-4xl font-black">{totals.total}<span className="text-lg opacity-40">/{totals.max}</span></span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase">
                  <span>Score Weightage</span>
                  <span>{totals.percent}%</span>
                </div>
                <div className="h-3 bg-slate-950/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${totals.percent}%` }} className="h-full bg-slate-950 shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md overflow-hidden">
            <h3 className="text-white font-bold text-sm mb-4 px-2 uppercase tracking-widest">Recent Certificates</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {savedMarksheets.length === 0 ? (
                <div className="flex flex-col items-center py-10 opacity-20">
                  <AlertCircle size={40} className="text-white mb-2" />
                  <p className="text-xs font-bold">No Records Found</p>
                </div>
              ) : (
                savedMarksheets.map((m) => (
                  <div key={m._id} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-tight">{m.examName}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => openPdf(m._id)} className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}