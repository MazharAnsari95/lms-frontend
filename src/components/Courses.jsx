import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const Courses = () => {
  const MotionDiv = motion.div;
  const [courseList, setCourseList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const naviagte = useNavigate();

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  const getCourses = () => {
    setIsLoading(true);
    api
      .get('/course/all-courses', { params })
      .then((res) => {
        setCourseList(res.data.courses || res.data.Courses || []);
        setMeta(res.data.meta || null);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      getCourses();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          placeholder="Search courses (name / description)"
        />
        <select
          className="list-select"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(1);
          }}
        >
          <option value={8}>8 / page</option>
          <option value={12}>12 / page</option>
          <option value={16}>16 / page</option>
          <option value={24}>24 / page</option>
        </select>
      </div>

      {isLoading && <div className="inline-loading">Loading…</div>}
      {!isLoading && courseList.length === 0 && (
        <div className="empty-state">No courses found.</div>
      )}

      <div className="course-wrapper">
        {courseList.map((course) => (
          <MotionDiv
            key={course._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              naviagte('/dashboard/course-detail/' + course._id);
            }}
            className="course-box"
          >
            <img alt="thumbnail" className="course-thumbnail" src={course.imageUrl} />
            <h2 className="course-title">{course.courseName}</h2>
            <p className="course-price"> Rs. {course.price} only </p>
          </MotionDiv>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}

export default Courses
