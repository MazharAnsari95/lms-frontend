import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format as formatDate } from 'date-fns';
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
  const [feeTrend, setFeeTrend] = useState([]); // { day, amount }
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

  useEffect(() => {
    api
      .get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) setCourseId((prev) => prev || list[0]._id);
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    if (!courseId || !date) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendanceLoading(true);
    api
      .get('/attendance', { params: { courseId, date } })
      .then((res) => {
        const items = res.data.attendance || [];
        let present = 0;
        let absent = 0;
        items.forEach((i) => {
          if (i.status === 'present') present += 1;
          else absent += 1;
        });
        setAttendanceSummary({ present, absent });
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setAttendanceLoading(false));
  }, [courseId, date]);

  useEffect(() => {
    // Fee trend doesn't require the date in backend; we show last ~7 days trend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeeLoading(true);
    api
      .get('/fee/payment-history', {
        params: { page: 1, limit: 30, q: '', sortBy: 'createdAt', order: 'desc' },
      })
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAssignmentsLoading(true);
    api
      .get('/assignment', { params: { page: 1, limit: 6, sortBy: 'createdAt', order: 'desc' } })
      .then((res) => setRecentAssignments(res.data.assignments || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setAssignmentsLoading(false));
  }, []);

  const attendanceRate = useMemo(() => {
    const total = attendanceSummary.present + attendanceSummary.absent;
    if (total === 0) return 0;
    return (attendanceSummary.present / total) * 100;
  }, [attendanceSummary]);

  const pieData = useMemo(
    () => [
      { name: 'Present', value: attendanceSummary.present },
      { name: 'Absent', value: attendanceSummary.absent },
    ],
    [attendanceSummary]
  );

  const presentColor = '#8b5cf6'; // violet
  const absentColor = '#f43f5e'; // rose

  return (
    <div className="space-y-6">
      <div className="card-solid p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="subtle">Attendance (course + day), fees trend, and recent assignments.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Course</label>
              <select
                className="input bg-slate-900 text-slate-100 border-white/10"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(d) => {
                  if (!d) return;
                  setDate(formatDate(d, 'yyyy-MM-dd'));
                }}
                dateFormat="yyyy-MM-dd"
                className="input bg-slate-900 text-slate-100 border-white/10"
                popperPlacement="bottom-start"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-300">Attendance Rate</div>
            <div className="mt-1 text-3xl font-bold text-white">{attendanceRate.toFixed(1)}%</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-300">Present</div>
            <div className="mt-1 text-3xl font-bold text-white">{attendanceSummary.present}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-300">Absent</div>
            <div className="mt-1 text-3xl font-bold text-white">{attendanceSummary.absent}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-300">Fees (recent)</div>
            <div className="mt-1 text-3xl font-bold text-white">Rs {feeSummary.total}</div>
            <div className="text-xs text-slate-400">{feeSummary.count} payments</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-solid p-4">
          <div className="flex items-center justify-between px-2 py-3">
            <div>
              <div className="text-lg font-semibold text-white">Attendance Split</div>
              <div className="text-sm text-slate-300">{attendanceLoading ? 'Loading…' : `For ${date}`}</div>
            </div>
          </div>
          <div className="h-64 w-full">
            {attendanceLoading ? (
              <div className="p-6 text-slate-300">Loading attendance chart...</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={idx === 0 ? presentColor : absentColor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card-solid p-4">
          <div className="flex items-center justify-between px-2 py-3">
            <div>
              <div className="text-lg font-semibold text-white">Fees Trend (last days)</div>
              <div className="text-sm text-slate-300">{feeLoading ? 'Loading…' : 'Total paid per day'}</div>
            </div>
          </div>
          <div className="h-64 w-full">
            {feeLoading ? (
              <div className="p-6 text-slate-300">Loading fees chart...</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={feeTrend}>
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="card-solid overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <div className="text-lg font-semibold text-white">Recent Assignments</div>
            <div className="text-sm text-slate-300">{assignmentsLoading ? 'Loading…' : 'Latest created assignments'}</div>
          </div>
          <div className="text-sm text-violet-300">Total: {recentAssignments.length}</div>
        </div>
        <div className="overflow-x-auto">
          {assignmentsLoading ? (
            <div className="p-6 text-slate-300">Loading assignments…</div>
          ) : recentAssignments.length === 0 ? (
            <div className="p-6 text-slate-300">No assignments found.</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Due</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Course</th>
                </tr>
              </thead>
              <tbody>
                {recentAssignments.map((a) => (
                  <tr key={a._id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{a.title}</td>
                    <td className="px-6 py-4 text-slate-200">
                      {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{a.courseId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

