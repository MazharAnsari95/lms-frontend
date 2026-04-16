import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
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
    if (!courseId) return;
    api
      .get(`/student/all-student/${courseId}`)
      .then((res) => {
        const list = res.data.studentList || [];
        setStudents(list);
        setStudentId((prev) => (list.some((s) => s._id === prev) ? prev : list[0]?._id || ''));
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [courseId]);

  useEffect(() => {
    if (!studentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedMarksheets([]);
      return;
    }
    api
      .get(`/marksheet/student/${studentId}`, { params: { courseId } })
      .then((res) => setSavedMarksheets(res.data.marksheets || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [studentId, courseId]);

  const totals = useMemo(() => {
    const total = subjects.reduce((sum, subject) => sum + Number(subject.marks || 0), 0);
    const max = subjects.reduce((sum, subject) => sum + Number(subject.maxMarks || 0), 0);
    return { total, max, percent: max > 0 ? ((total / max) * 100).toFixed(2) : '0.00' };
  }, [subjects]);

  const updateSubject = (index, key, value) => {
    setSubjects((prev) => prev.map((subject, i) => (i === index ? { ...subject, [key]: value } : subject)));
  };

  const addSubject = () => setSubjects((prev) => [...prev, blankSubject()]);
  const removeSubject = (index) => setSubjects((prev) => prev.filter((_, i) => i !== index));

  const submit = (e) => {
    e.preventDefault();
    if (!courseId || !studentId || !examName.trim()) {
      toast.error('Select course, student and exam name');
      return;
    }
    const cleaned = subjects.filter((s) => s.name.trim());
    if (cleaned.length === 0) {
      toast.error('Add at least one subject');
      return;
    }

    setIsSaving(true);
    api
      .post('/marksheet', {
        courseId,
        studentId,
        examName,
        remark,
        subjects: cleaned.map((s) => ({
          name: s.name,
          maxMarks: Number(s.maxMarks),
          marks: Number(s.marks),
        })),
      })
      .then((res) => {
        toast.success('Marksheet saved');
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
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-solid p-6">
        <div className="mb-5">
          <h1 className="page-title">Marksheet Generator</h1>
          <p className="subtle">Create marksheets, calculate totals automatically, and download PDF instantly.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Course</label>
              <select className="input" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Student</label>
              <select className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Exam Name</label>
              <input className="input" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Final Exam" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Remark</label>
              <input className="input" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Excellent / Good / Needs work" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="font-semibold text-white">Subjects</h2>
              <button className="btn-primary" type="button" onClick={addSubject}>
                <i className="fa-solid fa-plus"></i>
                Add Subject
              </button>
            </div>
            <div className="space-y-3 p-4">
              {subjects.map((subject, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <input
                      className="input"
                      value={subject.name}
                      onChange={(e) => updateSubject(index, 'name', e.target.value)}
                      placeholder="Subject name"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      className="input"
                      type="number"
                      value={subject.maxMarks}
                      onChange={(e) => updateSubject(index, 'maxMarks', e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      className="input"
                      type="number"
                      value={subject.marks}
                      onChange={(e) => updateSubject(index, 'marks', e.target.value)}
                      placeholder="Marks"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      className="h-full w-full rounded-xl border border-rose-200/30 bg-rose-900/20 text-rose-200"
                      onClick={() => removeSubject(index)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="card bg-violet-600/10 p-4">
              <div className="text-sm text-slate-300">Total Marks</div>
              <div className="mt-1 text-2xl font-bold text-white">{totals.total}</div>
            </div>
            <div className="card bg-emerald-600/10 p-4">
              <div className="text-sm text-slate-300">Max Marks</div>
              <div className="mt-1 text-2xl font-bold text-white">{totals.max}</div>
            </div>
            <div className="card bg-sky-600/10 p-4">
              <div className="text-sm text-slate-300">Percentage</div>
              <div className="mt-1 text-2xl font-bold text-white">{totals.percent}%</div>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={isSaving}>
            <i className="fa-solid fa-file-circle-plus"></i>
            {isSaving ? 'Saving...' : 'Save Marksheet'}
          </button>
        </form>
      </div>

      <div className="card-solid overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Saved Marksheets</h2>
        </div>
        {savedMarksheets.length === 0 ? (
          <div className="p-6 text-slate-600">No marksheets found for this student.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">PDF</th>
                </tr>
              </thead>
              <tbody>
                {savedMarksheets.map((item) => (
                  <tr key={item._id} className="border-t border-white/10">
                    <td className="px-6 py-4 font-medium text-white">{item.examName}</td>
                    <td className="px-6 py-4 text-slate-200">{item.subjects?.length || 0}</td>
                    <td className="px-6 py-4 text-slate-200">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button className="btn-primary" type="button" onClick={() => openPdf(item._id)}>
                        <i className="fa-solid fa-file-pdf"></i>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

