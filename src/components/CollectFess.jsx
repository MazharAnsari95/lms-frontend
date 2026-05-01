import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  IndianRupee, 
  User, 
  Phone, 
  FileText, 
  BookOpen, 
  Wallet, 
  Loader2,
  CheckCircle2,
  ReceiptText
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const CollectFees = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then(res => {
        setCourseList(res.data.courses || res.data.Courses || []);
      })
      .catch(err => toast.error(getErrorMessage(err)));
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!courseId) return toast.error("Please select a course");
    
    setLoading(true);
    api.post('/fee/add-fee', {
      fullName,
      amount: Number(amount),
      phone,
      remark,
      courseId
    })
      .then(() => {
        toast.success('Payment recorded successfully');
        navigate('/dashboard/payment-history');
      })
      .catch(err => {
        setLoading(false);
        toast.error(getErrorMessage(err));
      });
  };

  // Find selected course name for the receipt preview
  const selectedCourse = courseList.find(c => c._id === courseId)?.courseName || "Not Selected";

  return (
    <div className="min-h-screen p-4 lg:p-8 max-w-6xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center lg:justify-start gap-3">
          <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-900/20">
            <Wallet size={28} />
          </div>
          Collect Fees
        </h1>
        <p className="text-slate-400 mt-2 text-sm uppercase tracking-[0.2em] font-semibold">
          Financial Management System
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- FORM SECTION (Left) --- */}
        <div className="lg:col-span-7">
          <form onSubmit={submitHandler} className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-xl shadow-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    required 
                    className="w-full h-13 pl-12 pr-4 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:border-violet-500/50 focus:bg-slate-950 transition-all shadow-inner"
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    required 
                    className="w-full h-13 pl-12 pr-4 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:border-violet-500/50 focus:bg-slate-950 transition-all shadow-inner"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enrolled Course</label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                <select 
                  required
                  className="w-full h-13 pl-12 pr-10 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                  value={courseId} 
                  onChange={e => setCourseId(e.target.value)}
                >
                  <option value="">Select a Course</option>
                  {courseList.map((course) => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">▼</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fee Amount</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    required 
                    type="number"
                    className="w-full h-13 pl-12 pr-4 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:border-emerald-500/50 transition-all font-bold text-lg"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Note / Remark</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    className="w-full h-13 pl-12 pr-4 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:border-violet-500/50 transition-all shadow-inner"
                    placeholder="Month, Cash/UPI, etc."
                    value={remark}
                    onChange={e => setRemark(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="group relative w-full h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-violet-900/40 overflow-hidden active:scale-[0.98] disabled:opacity-50"
              type="submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              Confirm & Collect Payment
            </button>
          </form>
        </div>

        {/* --- RECEIPT PREVIEW (Right) --- */}
        <div className="lg:col-span-5">
          <div className="bg-black text-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative">
            {/* Punch-hole design elements */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-950 rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-950 rounded-full" />
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <ReceiptText size={24} className="text-slate-400" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Digital Receipt</h2>
              <div className="h-1 w-10 bg-violet-500 rounded-full mt-2" />
            </div>

            <div className="space-y-5 border-b border-dashed border-slate-600 pb-8">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Student</span>
                <span className="font-bold text-right text-sm max-w-[150px]">{fullName || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Course</span>
                <span className="font-bold text-right text-sm text-violet-600 max-w-[150px]">{selectedCourse}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Phone</span>
                <span className="font-medium text-sm italic">{phone || "—"}</span>
              </div>
            </div>

            <div className="py-8 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">Total Paid Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-light text-slate-400">₹</span>
                <span className="text-5xl font-black tracking-tighter">{amount || "0"}</span>
              </div>
            </div>

            <div className="bg-slate-500 rounded-2xl p-4 text-center mb-8 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Internal Note</p>
              <p className="text-xs text-slate-600 italic">"{remark || "No additional notes provided"}"</p>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">
                TXN-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CollectFees;