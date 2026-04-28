import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  History, 
  IndianRupee,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const StudentDetail = () => {
  const [student, setStudent] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  const getStudentDetail = () => {
    setIsLoading(true);
    api.get('/student/student-detail/' + params.id)
      .then(res => {
        setStudent(res.data.studentDetail);
        setPaymentList(res.data.feeDetail || []);
        setCourse(res.data.courseDetail || {});
      })
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getStudentDetail();
  }, [params.id]);

  const deleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      api.delete('/student/' + studentId)
        .then(() => {
          toast.success('Student record deleted successfully');
          navigate('/dashboard/course-detail/' + course._id);
        })
        .catch(err => toast.error(getErrorMessage(err)));
    }
  };

  // Calculate Total Paid
  const totalPaid = paymentList.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="min-h-screen space-y-8 p-4 lg:p-8 max-w-6xl mx-auto">
      
      {/* --- TOP NAVIGATION & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to List
        </button>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            onClick={() => navigate('/dashboard/update-student/' + student._id, { state: { student } })}
          >
            <Edit3 size={18} className="text-violet-400" /> Edit Profile
          </button>
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            onClick={() => deleteStudent(student._id)}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* --- PROFILE HEADER CARD --- */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Main Identity */}
        <div className="lg:col-span-2 rounded-[2.5rem] bg-slate-900/40 border border-white/10 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start backdrop-blur-md">
          <div className="relative">
            <img 
              alt="student pic" 
              src={student.imageUrl} 
              className="h-40 w-40 rounded-[2rem] object-cover ring-4 ring-violet-500/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">{student.fullName}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-violet-400 font-medium">
                <BookOpen size={18} /> {course.courseName}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                <div className="p-2 rounded-lg bg-white/5"><Phone size={16} /></div>
                <span className="text-sm">{student.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                <div className="p-2 rounded-lg bg-white/5"><Mail size={16} /></div>
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400 sm:col-span-2">
                <div className="p-2 rounded-lg bg-white/5"><MapPin size={16} /></div>
                <span className="text-sm">{student.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats Card */}
        <div className="rounded-[2.5rem] bg-violet-600 p-8 text-white flex flex-col justify-between shadow-2xl shadow-violet-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-1">Total Fee Collected</p>
            <h2 className="text-5xl font-black flex items-center">
              <IndianRupee size={32} /> {totalPaid}
            </h2>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/20">
            <p className="text-sm font-medium opacity-80 italic">"Keep records updated to ensure seamless access for the student."</p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* --- PAYMENT HISTORY TABLE --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <History size={20} className="text-violet-400" />
          <h2 className="text-xl font-bold">Payment History</h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Remark</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paymentList.length > 0 ? paymentList.map((payment) => (
                <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors text-slate-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-500" />
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 text-sm italic text-slate-500">
                    {payment.remark || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Success</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No payment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentDetail;