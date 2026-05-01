import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format as formatDate } from 'date-fns';
import { 
  Users, 
  CreditCard, 
  BookOpen, 
  Calendar as CalendarIcon, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

import { api, getErrorMessage } from '../lib/api';

const today = new Date().toISOString().slice(0, 10);

export default function Analytics() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(today);

  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0 });
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [feeSummary, setFeeSummary] = useState({ total: 0, count: 0 });
  const [feeTrend, setFeeTrend] = useState([]);
  const [feeLoading, setFeeLoading] = useState(false);

  const [recentAssignments, setRecentAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  const selectedDate = useMemo(() => {
    try {
      return date ? parseISO(date) : null;
    } catch {
      return null;
    }
  }, [date]);

  // Data Fetching Logic (Keeping your existing logic but wrapping in a cleaner flow)
  useEffect(() => {
    api.get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) setCourseId((prev) => prev || list[0]._id);
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    if (!courseId || !date) return;
    setAttendanceLoading(true);
    api.get('/attendance', { params: { courseId, date } })
      .then((res) => {
        const items = res.data.attendance || [];
        let present = 0, absent = 0;
        items.forEach((i) => (i.status === 'present' ? present++ : absent++));
        setAttendanceSummary({ present, absent });
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setAttendanceLoading(false));
  }, [courseId, date]);

  useEffect(() => {
    setFeeLoading(true);
    api.get('/fee/payment-history', { params: { page: 1, limit: 30, sortBy: 'createdAt', order: 'desc' } })
      .then((res) => {
        const payments = res.data.paymentHistory || [];
        const total = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        setFeeSummary({ total, count: payments.length });

        const buckets = {};
        payments.forEach((p) => {
          const day = p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : 'unknown';
          buckets[day] = (buckets[day] || 0) + Number(p.amount || 0);
        });

        const trend = Object.entries(buckets)
          .map(([day, amount]) => ({ day, amount }))
          .sort((a, b) => a.day.localeCompare(b.day))
          .slice(-7);
        setFeeTrend(trend);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setFeeLoading(false));
  }, []);

  useEffect(() => {
    setAssignmentsLoading(true);
    api.get('/assignment', { params: { page: 1, limit: 6, sortBy: 'createdAt', order: 'desc' } })
      .then((res) => setRecentAssignments(res.data.assignments || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setAssignmentsLoading(false));
  }, []);

  const attendanceRate = useMemo(() => {
    const total = attendanceSummary.present + attendanceSummary.absent;
    return total === 0 ? 0 : (attendanceSummary.present / total) * 100;
  }, [attendanceSummary]);

  // UI Constants
  const COLORS = {
    present: '#10b981', // Emerald 500
    absent: '#f43f5e',  // Rose 500
    primary: '#8b5cf6', // Violet 500
    grid: 'rgba(255, 255, 255, 0.05)'
  };

  return (
    <div className="min-h-screen space-y-8 p-4 pb-12 lg:p-8">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Analytics Overview</h1>
          <p className="mt-1 text-slate-400">Real-time insights into attendance, revenue, and academic progress.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-slate-950 px-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">Course</label>
            <select
              className="h-11 rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm text-white focus:border-violet-500 focus:ring-0"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id} className="bg-black">{c.courseName}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-slate-950 px-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">Reference Date</label>
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3">
              <CalendarIcon size={16} className="text-slate-400" />
              <DatePicker
                selected={selectedDate}
                onChange={(d) => d && setDate(formatDate(d, 'yyyy-MM-dd'))}
                dateFormat="MMM d, yyyy"
                className="h-11 bg-transparent pl-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance Rate" value={`${attendanceRate.toFixed(1)}%`} icon={<Users className="text-emerald-400" />} subtitle="Avg. student presence" />
        <StatCard title="Present Today" value={attendanceSummary.present} icon={<TrendingUp className="text-violet-400" />} subtitle="Students checked-in" />
        <StatCard title="Absent" value={attendanceSummary.absent} icon={<Users className="text-rose-400" />} subtitle="Missing students" />
        <StatCard title="Revenue (30d)" value={`₹${feeSummary.total.toLocaleString()}`} icon={<CreditCard className="text-amber-400" />} subtitle={`${feeSummary.count} transactions`} />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Attendance Pie */}
        <div className="col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Attendance Split</h3>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">Live</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: attendanceSummary.present },
                    { name: 'Absent', value: attendanceSummary.absent },
                  ]}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill={COLORS.present} stroke="none" />
                  <Cell fill={COLORS.absent} stroke="none" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6 text-sm">
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-500" /> <span className="text-slate-300">Present</span></div>
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-rose-500" /> <span className="text-slate-300">Absent</span></div>
            </div>
          </div>
        </div>

        {/* Fee Trend Line Chart */}
        <div className="col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Fee Collection Trend</h3>
            <div className="text-xs text-slate-400">Last 7 Active Days</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={feeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke={COLORS.primary} 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: COLORS.primary, strokeWidth: 2, stroke: '#0f172a' }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-500/20 p-2 text-violet-400">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Recent Assignments</h3>
          </div>
          <button className="text-sm font-medium text-violet-400 hover:text-violet-300">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-8 py-4">Assignment Title</th>
                <th className="px-8 py-4">Deadline</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentAssignments.map((a) => (
                <tr key={a._id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-8 py-5">
                    <div className="font-medium text-slate-200">{a.title}</div>
                    <div className="text-xs text-slate-500">ID: {a.courseId}</div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400">
                    {a.dueDate ? formatDate(parseISO(a.dueDate.split('T')[0]), 'MMM dd, yyyy') : 'No Date'}
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-white">
                      Details <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentAssignments.length === 0 && !assignmentsLoading && (
            <div className="py-20 text-center text-slate-500">No recent assignments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h4 className="mt-2 text-3xl font-bold text-white">{value}</h4>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500 font-medium">{subtitle}</p>
      {/* Decorative background element */}
      <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white/5 blur-2xl" />
    </div>
  );
}