import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Users, 
  Search, 
  GraduationCap,
  Loader2,
  Check,
  Mail,
  Phone
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import { parseISO, format as formatDate } from 'date-fns';
import { api, getErrorMessage } from '../lib/api';
import 'react-datepicker/dist/react-datepicker.css';

const today = new Date().toISOString().slice(0, 10);

export default function Attendance() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const canLoad = useMemo(() => Boolean(courseId && date), [courseId, date]);
  const selectedDate = useMemo(() => (date ? parseISO(date) : null), [date]);

  useEffect(() => {
    if (!canLoad) return;
    setIsLoading(true);
    api.get('/attendance', { params: { courseId, date } })
      .then((res) => {
        const studentList = res.data.students || [];
        const map = {};
        (res.data.attendance || []).forEach((item) => {
          map[item.studentId] = item.status;
        });
        setStudents(studentList);
        setAttendance(map);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [canLoad, courseId, date]);

  const setAllStatus = (status) => {
    const map = {};
    students.forEach(s => map[s._id] = status);
    setAttendance(map);
  };

  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    const entries = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] || 'absent',
    }));

    setIsSaving(true);
    api.post('/attendance/mark', { courseId, date, entries })
      .then(() => toast.success('Attendance synced successfully'))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6">
      
      {/* --- TOP CONTROL PANEL --- */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <CalendarDays className="text-violet-500" size={28} />
              Daily Attendance
            </h1>
            <p className="text-slate-400 text-sm mt-1">Select parameters to start marking presence.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 ml-2 tracking-widest">Target Course</span>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <select
                  className="bg-slate-950 border border-white/10 text-white text-sm rounded-xl pl-10 pr-8 py-2.5 outline-none focus:border-violet-500 transition-all appearance-none"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Choose Course</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 ml-2 tracking-widest">Session Date</span>
              <DatePicker
                selected={selectedDate}
                onChange={(d) => d && setDate(formatDate(d, 'yyyy-MM-dd'))}
                dateFormat="dd MMM yyyy"
                className="bg-slate-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 w-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- ATTENDANCE LIST --- */}
      <div className="bg-slate-900/20 border border-white/10 rounded-[2rem] overflow-hidden">
        <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-slate-400" />
            <h2 className="font-bold text-white uppercase tracking-tighter text-sm">Roster ({students.length})</h2>
          </div>
          
          {students.length > 0 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAllStatus('present')}
                className="text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-all"
              >
                MARK ALL PRESENT
              </button>
              <button 
                disabled={isSaving}
                onClick={saveAttendance}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-violet-900/20"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                SAVE CHANGES
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-violet-500" size={32} />
            <p className="text-slate-500 text-sm">Fetching student roster...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center">
            <Search size={40} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 italic">No students found for this selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student) => {
                  const isPresent = attendance[student._id] === 'present';
                  return (
                    <tr key={student._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={student.imageUrl} alt="" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-violet-500/30 transition-all" />
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors uppercase tracking-tight">{student.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">ID: {student._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-400 space-y-0.5">
                          <p className="flex items-center gap-1"><Mail size={10} /> {student.email}</p>
                          <p className="flex items-center gap-1 text-slate-500"><Phone size={10} /> {student.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5">
                            <button
                              onClick={() => toggleStatus(student._id, 'present')}
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                                isPresent 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                                : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {isPresent && <Check size={12} />} PRESENT
                            </button>
                            <button
                              onClick={() => toggleStatus(student._id, 'absent')}
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                                !isPresent 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-900/20' 
                                : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {!isPresent && <Check size={12} />} ABSENT
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}