import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

export default function Assignments() {
  const MotionDiv = motion.div;
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(true);
      api
        .get('/assignment', { params })
        .then((res) => {
          setItems(res.data.assignments || []);
          setMeta(res.data.meta || null);
        })
        .catch((err) => toast.error(getErrorMessage(err)))
        .finally(() => setIsLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <div>
      <div className="list-toolbar">
        <input
          className="list-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search assignments (title / description)"
        />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select
            className="list-select"
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <button className="btn btn-primary" type="button" onClick={() => navigate('/dashboard/add-assignment')}>
            <i className="fa-solid fa-plus"></i>
            New Assignment
          </button>
        </div>
      </div>

      {isLoading && <div className="inline-loading">Loading…</div>}
      {!isLoading && items.length === 0 && <div className="empty-state">No assignments found.</div>}

      <div className="course-wrapper">
        {items.map((a) => (
          <MotionDiv
            key={a._id}
            className="course-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/dashboard/assignment-detail/' + a._id)}
          >
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <h2 className="course-title" style={{ textAlign: 'left', margin: 0 }}>
                  {a.title}
                </h2>
                <span style={{ fontSize: 12, color: '#555' }}>
                  {a.dueDate ? `Due: ${new Date(a.dueDate).toLocaleDateString()}` : 'No due date'}
                </span>
              </div>
              <p style={{ marginTop: 8, color: '#444', fontSize: 13, lineHeight: 1.35 }}>
                {(a.description || '').slice(0, 120)}
                {a.description && a.description.length > 120 ? '…' : ''}
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 12, color: '#7033FF' }}>
                  <i className="fa-solid fa-book"></i> {a.courseId}
                </span>
                {a.attachmentUrl && (
                  <span style={{ fontSize: 12, color: '#F65164' }}>
                    <i className="fa-solid fa-paperclip"></i> Attachment
                  </span>
                )}
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}

