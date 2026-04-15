import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const Students = () => {
  const MotionTr = motion.tr;
  const MotionDiv = motion.div;
  const [studentList, setStudentList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(true);
      api
        .get('/student/all-student', { params })
        .then((res) => {
          setStudentList(res.data.studentList || []);
          setMeta(res.data.meta || null);
        })
        .catch((err) => {
          toast.error(getErrorMessage(err));
        })
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
          placeholder="Search students (name / email / phone)"
        />
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
      </div>

      {isLoading && <div className="inline-loading">Loading…</div>}

      {!isLoading && studentList.length === 0 && (
        <div className="empty-state">No students found.</div>
      )}

      {studentList.length > 0 && (
        <>
          <div className="students-container students-table">
            <table>
              <thead>
                <tr>
                  <th>Student's Pic</th>
                  <th>Student Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <MotionTr
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      navigate('/dashboard/student-detail/' + student._id);
                    }}
                    key={student._id}
                    className="student-row"
                  >
                    <td>
                      <img
                        className="student-profile-pic"
                        alt="student pic"
                        src={student.imageUrl}
                      />
                    </td>
                    <td>
                      <p>{student.fullName}</p>
                    </td>
                    <td>
                      <p>{student.phone}</p>
                    </td>
                    <td>
                      <p>{student.email}</p>
                    </td>
                  </MotionTr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="students-cards">
            {studentList.map((student) => (
              <MotionDiv
                key={student._id}
                className="student-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate('/dashboard/student-detail/' + student._id)}
              >
                <img className="student-card-pic" alt="student pic" src={student.imageUrl} />
                <div className="student-card-body">
                  <div className="student-card-name">{student.fullName}</div>
                  <div className="student-card-meta">{student.phone}</div>
                  <div className="student-card-meta">{student.email}</div>
                </div>
              </MotionDiv>
            ))}
          </div>

          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

    </div>
  )
}

export default Students
