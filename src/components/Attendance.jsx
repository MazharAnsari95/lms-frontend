import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format as formatDate } from 'date-fns';

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
    api
      .get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) setCourseId((prev) => prev || list[0]._id);
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  const canLoad = useMemo(() => Boolean(courseId && date), [courseId, date]);
  const selectedDate = useMemo(() => {
    try {
      return date ? parseISO(date) : null;
    } catch {
      return null;
    }
  }, [date]);

  useEffect(() => {
    if (!canLoad) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    api
      .get('/attendance', { params: { courseId, date } })
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

  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    if (!courseId || !date) {
      toast.error('Select course and date');
      return;
    }
    const entries = students.map((student) => ({
      studentId: student._id,
      status: attendance[student._id] || 'absent',
    }));

    setIsSaving(true);
    api
      .post('/attendance/mark', { courseId, date, entries })
      .then(() => toast.success('Attendance saved'))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="space-y-6 bg-slate-900 text-slate-100">
      <div className="card-solid p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">Attendance Marking</h1>
            <p className="subtle">Select course and date, then mark each student present or absent.</p>
          </div>
          <button className="btn-primary" type="button" onClick={saveAttendance} disabled={isSaving || students.length === 0}>
            <i className="fa-solid fa-floppy-disk"></i>
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Course</label>
            <select
              className="input bg-slate-900 text-slate-100 border-white/10"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
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

      <div className="card-solid overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Student List</h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-slate-600">Loading attendance...</div>
        ) : students.length === 0 ? (
          <div className="p-6 text-slate-600">No students found for this course.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const status = attendance[student._id] || 'absent';
                  return (
                    <tr key={student._id} className="border-t border-white/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={student.imageUrl} alt={student.fullName} className="h-11 w-11 rounded-xl object-cover shadow" />
                          <div>
                            <div className="font-medium text-slate-100">{student.fullName}</div>
                            <div className="text-sm text-slate-300">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-200">{student.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className={
                              status === 'present'
                                ? 'btn-primary'
                                : 'rounded-xl border border-white/15 bg-slate-900/20 px-4 py-2 text-slate-200'
                            }
                            onClick={() => toggleStatus(student._id, 'present')}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            className={
                              status === 'absent'
                                ? 'btn-danger'
                                : 'rounded-xl border border-white/15 bg-slate-900/20 px-4 py-2 text-slate-200'
                            }
                            onClick={() => toggleStatus(student._id, 'absent')}
                          >
                            Absent
                          </button>
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

