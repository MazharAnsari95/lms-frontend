
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
        console.log('API Error:', err);
        toast.error(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getHomeDetails();
  }, []);

  const quickCards = useMemo(
    () => [
      {
        title: 'Courses',
        value: totalCourse,
        icon: 'fa-book-open',
        action: () => navigate('/dashboard/courses'),
        gradient: 'from-violet-600 to-indigo-500',
      },
      {
        title: 'Students',
        value: totalStudent,
        icon: 'fa-user-graduate',
        action: () => navigate('/dashboard/students'),
        gradient: 'from-sky-500 to-cyan-500',
      },
      {
        title: 'Collections',
        value: `Rs ${totalAmount}`,
        icon: 'fa-wallet',
        action: () => navigate('/dashboard/payment-history'),
        gradient: 'from-emerald-500 to-teal-500',
      },
      {
        title: 'Assignments',
        value: 'Manage',
        icon: 'fa-clipboard-list',
        action: () => navigate('/dashboard/assignments'),
        gradient: 'from-rose-500 to-pink-500',
      },
    ],
    [navigate, totalAmount, totalCourse, totalStudent]
  );

  return (
    <div className="space-y-6">
      <div className="card-solid overflow-hidden">
        <div className="grid gap-6 bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-6 py-8 text-white lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
              Overview Dashboard
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              Welcome back, {localStorage.getItem('fullName') || 'Admin'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
              First see the complete institute data here, then open the detailed screens for students, fees,
              attendance, marksheets, assignments, and courses.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary" type="button" onClick={() => navigate('/dashboard/attendance')}>
                <i className="fa-solid fa-calendar-check"></i>
                Mark Attendance
              </button>
              <button className="btn-primary" type="button" onClick={() => navigate('/dashboard/marksheet')}>
                <i className="fa-solid fa-file-lines"></i>
                Generate Marksheet
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={
                localStorage.getItem('imageUrl') ||
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop'
              }
              alt="overview"
              className="h-56 w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/15"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.action}
            className="card-solid group p-5 text-left transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
            >
              <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <div className="mt-4 text-sm font-medium text-slate-300">{card.title}</div>
            <div className="mt-1 text-3xl font-bold text-white">{card.value}</div>
            <div className="mt-3 text-sm text-violet-600 group-hover:text-violet-700">Open details →</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-solid overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Students</h2>
              <p className="subtle">Latest enrolled students</p>
            </div>
            <button className="text-sm font-medium text-violet-600" onClick={() => navigate('/dashboard/students')}>
              View all
            </button>
          </div>
          {isLoading ? (
            <div className="p-6 text-slate-300">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-6 text-slate-300">No students found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <button
                  key={student._id}
                  type="button"
                  onClick={() => navigate(`/dashboard/student-detail/${student._id}`)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-white/5"
                >
                  <img className="h-12 w-12 rounded-xl object-cover shadow" alt="student pic" src={student.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">{student.fullName}</div>
                    <div className="truncate text-sm text-slate-300">{student.email}</div>
                  </div>
                  <div className="hidden text-sm text-slate-300 md:block">{student.phone}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-solid overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Fee Collection</h2>
              <p className="subtle">Latest paid transactions</p>
            </div>
            <button
              className="text-sm font-medium text-violet-600"
              onClick={() => navigate('/dashboard/payment-history')}
            >
              View all
            </button>
          </div>
          {isLoading ? (
            <div className="p-6 text-slate-300">Loading...</div>
          ) : fees.length === 0 ? (
            <div className="p-6 text-slate-300">No payment history found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fees.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <div className="font-medium text-white">{payment.fullName}</div>
                    <div className="text-sm text-slate-300">{new Date(payment.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600">Rs {payment.amount}</div>
                    <div className="text-sm text-slate-300">{payment.remark}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
