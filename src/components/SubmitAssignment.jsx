import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

export default function SubmitAssignment() {
  const { id } = useParams(); // assignmentId
  const [assignment, setAssignment] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Load assignment detail (requires institute auth). For demo, we only need courseId.
    // If the user is not logged in, we still allow submission by selecting studentId manually.
    api
      .get('/assignment/' + id)
      .then((res) => {
        setAssignment(res.data.assignment);
        return res.data.assignment?.courseId;
      })
      .then((courseId) => {
        if (!courseId) return;
        return api.get('/student/all-student/' + courseId).then((res) => setCourseStudents(res.data.studentList || []));
      })
      .catch(() => {
        // If not authorized, we won't block the submit page; user can still enter studentId.
      });
  }, [id]);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('studentId', studentId);
    fd.append('notes', notes);
    if (file) fd.append('file', file);

    // This endpoint is public (no auth) in backend.
    api
      .post('/assignment/' + id + '/submit', fd)
      .then(() => toast.success('Submitted successfully'))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  return (
    <div className="signup-wrapper" style={{ height: 'auto', minHeight: 'calc(100vh - 20px)' }}>
      <div className="signup-box" style={{ minHeight: 'unset', maxWidth: 820 }}>
        <div className="signup-left">
          <h1 className="signup-left-heading">Submit Assignment</h1>
          <p className="signup-left-para">
            {assignment ? assignment.title : 'Upload your work and submit.'}
          </p>
        </div>
        <div className="signup-right">
          <form onSubmit={submit} className="form" style={{ minHeight: 'unset' }}>
            <h2 style={{ marginTop: 10 }}>Student Submission</h2>

            {courseStudents.length > 0 ? (
              <select className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                <option value="">Select Student</option>
                {courseStudents.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.fullName} ({s.phone})
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student ID"
                required
              />
            )}

            <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
            <input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

