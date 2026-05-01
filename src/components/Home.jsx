import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

const Home = () => {
  const navigate = useNavigate();
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalAmount, setAmount] = useState(0);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function getHomeDetails() {
    setIsLoading(true);
    api
      .get('/course/home')
      .then((res) => {
        setTotalCourse(res.data.totalCourse);
        setTotalStudent(res.data.totalStudent);
        setStudents(res.data.students);
        setFees(res.data.fees);
        setAmount(res.data.totalAmount);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getHomeDetails();
  }, []);

  const quickCards = useMemo(
    () => [
      {
        title: 'Courses',
        value: totalCourse,
        icon: 'fa-book-open',
        action: () => navigate('/dashboard/courses'),
        color: 'text-violet-400',
        bg: 'bg-violet-400/10',
      },
      {
        title: 'Students',
        value: totalStudent,
        icon: 'fa-user-graduate',
        action: () => navigate('/dashboard/students'),
        color: 'text-sky-400',
        bg: 'bg-sky-400/10',
      },
      {
        title: 'Collections',
        value: `₹${totalAmount.toLocaleString()}`,
        icon: 'fa-wallet',
        action: () => navigate('/dashboard/payment-history'),
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
      },
      {
        title: 'Assignments',
        value: 'Manage',
        icon: 'fa-clipboard-list',
        action: () => navigate('/dashboard/assignments'),
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
      },
    ],
    [navigate, totalAmount, totalCourse, totalStudent]
  );

  return (
    <div className="min-h-screen space-y-8 p-4 pb-12 lg:p-8">
      {/* --- Header Section --- */}
      <header className="relative overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent"></div>
        <div className="relative z-10 grid items-center gap-8 px-8 py-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              Admin Portal v2.0
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {localStorage.getItem('fullName') || 'Administrator'}
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Manage your institute's ecosystem with precision. Track growth, payments, and student progress in real-time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/dashboard/attendance')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                <i className="fa-solid fa-calendar-check"></i> Attendance
              </button>
              <button 
                onClick={() => navigate('/dashboard/marksheet')}
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition hover:bg-slate-700"
              >
                <i className="fa-solid fa-file-invoice"></i> Marksheets
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative mx-auto h-64 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/5">
              <img
                src={localStorage.getItem('imageUrl') || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800'}
                alt="Dashboard Visual"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- Stat Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickCards.map((card) => (
          <button
            key={card.title}
            onClick={card.action}
            className="group relative overflow-hidden rounded-2xl bg-black/50 p-6 text-left ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:bg-slate-800 hover:ring-indigo-500/50"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color} mb-4 text-xl shadow-inner`}>
              <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <p className="text-sm font-medium text-slate-400">{card.title}</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{card.value}</h3>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
              EXPLORE DETAILS <i className="fa-solid fa-chevron-right ml-2 text-[10px]"></i>
            </div>
          </button>
        ))}
      </div>

      {/* --- Main Content Tables --- */}
      <div className="grid gap-8 xl:grid-cols-2">
        {/* Recent Students */}
        <section className="rounded-3xl bg-black/50 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div>
              <h2 className="text-xl font-bold text-white">Latest Enrollments</h2>
              <p className="text-sm text-slate-500">Newly joined students</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/students')}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-400 hover:bg-white/10 transition"
            >
              See All
            </button>
          </div>
          
          <div className="p-2">
            {isLoading ? (
               <div className="p-10 text-center text-slate-500 animate-pulse">Fetching records...</div>
            ) : students.length === 0 ? (
               <div className="p-10 text-center text-slate-500 italic">No students registered yet.</div>
            ) : (
              <div className="space-y-1">
                {students.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => navigate(`/dashboard/student-detail/${student._id}`)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition hover:bg-white/5 group"
                  >
                    <img className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500" src={student.imageUrl} alt="" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200">{student.fullName}</h4>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 hidden sm:block">
                      <i className="fa-solid fa-phone mr-2"></i>{student.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Fee Collection */}
        <section className="rounded-3xl bg-black/50 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Stream</h2>
              <p className="text-sm text-slate-500">Recent fee transactions</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/payment-history')}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-400 hover:bg-white/10 transition"
            >
              History
            </button>
          </div>

          <div className="p-2">
            {isLoading ? (
               <div className="p-10 text-center text-slate-500 animate-pulse">Updating ledger...</div>
            ) : fees.length === 0 ? (
               <div className="p-10 text-center text-slate-500 italic">No payments recorded.</div>
            ) : (
              <div className="space-y-1">
                {fees.map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between rounded-2xl p-4 transition hover:bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <i className="fa-solid fa-arrow-down-long"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200">{payment.fullName}</h4>
                        <p className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">₹{payment.amount}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500">{payment.remark || 'TUTION FEE'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;