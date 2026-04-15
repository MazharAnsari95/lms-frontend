import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/assignment/' + id)
      .then((res) => {
        setAssignment(res.data.assignment);
        setSubmissions(res.data.submissions || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const del = () => {
    if (!window.confirm('Delete this assignment?')) return;
    api
      .delete('/assignment/' + id)
      .then(() => {
        toast.success('Deleted');
        navigate('/dashboard/assignments');
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  };

  if (isLoading) return <div className="inline-loading">Loading…</div>;
  if (!assignment) return <div className="empty-state">Assignment not found.</div>;

  const submitLink = `${window.location.origin}/dashboard/submit-assignment/${assignment._id}`;

  return (
    <div className="course-detail-page">
      <div className="course-detail-container" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h1 style={{ margin: 0 }}>{assignment.title}</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" type="button" onClick={() => navigate('/dashboard/add-assignment', { state: { assignment } })}>
                <i className="fa-solid fa-pen-to-square"></i>
                Edit
              </button>
              <button className="btn btn-danger" type="button" onClick={del}>
                <i className="fa-solid fa-trash"></i>
                Delete
              </button>
            </div>
          </div>

          <p style={{ color: '#444', marginTop: 10 }}>{assignment.description || 'No description.'}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, color: '#555' }}>
            <span>
              <i className="fa-solid fa-book"></i> Course: <b>{assignment.courseId}</b>
            </span>
            <span>
              <i className="fa-regular fa-clock"></i>{' '}
              Due: <b>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No due date'}</b>
            </span>
            {assignment.attachmentUrl && (
              <a href={assignment.attachmentUrl} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-paperclip"></i> Attachment
              </a>
            )}
          </div>

          <div style={{ marginTop: 14, padding: 12, background: '#f5f7fb', borderRadius: 12, border: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Student submit link (demo)</div>
            <div style={{ wordBreak: 'break-all', fontSize: 13 }}>{submitLink}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h2 style={{ margin: '10px 0' }}>Submissions ({submissions.length})</h2>
        {submissions.length === 0 ? (
          <div className="empty-state">No submissions yet.</div>
        ) : (
          <div className="studentlist-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>File</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentName}</td>
                    <td>{s.studentPhone}</td>
                    <td style={{ maxWidth: 320 }}>{s.notes}</td>
                    <td>{s.fileUrl ? <a href={s.fileUrl} target="_blank" rel="noreferrer">Open</a> : '—'}</td>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
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

