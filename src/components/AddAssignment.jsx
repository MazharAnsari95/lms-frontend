import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

export default function AddAssignment() {
  const location = useLocation();
  const navigate = useNavigate();
  const editing = location.state?.assignment;

  const [title, setTitle] = useState(editing?.title || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [courseId, setCourseId] = useState(editing?.courseId || '');
  const [dueDate, setDueDate] = useState(editing?.dueDate ? new Date(editing.dueDate).toISOString().slice(0, 10) : '');
  const [attachment, setAttachment] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then((res) => setCourseList(res.data.courses || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('courseId', courseId);
    if (dueDate) fd.append('dueDate', new Date(dueDate).toISOString());
    if (attachment) fd.append('attachment', attachment);

    const req = editing ? api.put('/assignment/' + editing._id, fd) : api.post('/assignment', fd);

    req
      .then((res) => {
        toast.success(editing ? 'Assignment updated' : 'Assignment created');
        navigate('/dashboard/assignment-detail/' + (res.data.assignment?._id || editing?._id));
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <form onSubmit={submit} className="form" style={{ minHeight: 'unset' }}>
        <h1>{editing ? 'Edit Assignment' : 'Create Assignment'}</h1>

        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <select className="input" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">Select Course</option>
          {courseList.map((c) => (
            <option key={c._id} value={c._id}>
              {c.courseName}
            </option>
          ))}
        </select>

        <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input className="input" type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />

        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}

