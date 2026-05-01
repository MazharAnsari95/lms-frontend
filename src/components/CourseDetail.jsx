import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  IndianRupee, 
  Trash2, 
  Edit3, 
  Users, 
  ArrowLeft,
  Mail,
  Phone,
  ChevronRight
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const CourseDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCourseDetail = () => {
    setLoading(true);
    api.get('/course/course-detail/' + params.id)
      .then(res => {
        setCourse(res.data.course);
        setStudentList(res.data.studentList);
      })
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCourseDetail();
  }, [params.id]);

  const deleteCourse = (courseId) => {
    if (window.confirm('This action is permanent. Are you sure you want to delete this course?')) {
      api.delete('/course/' + courseId)
        .then(() => {
          toast.success("Course deleted successfully");
          navigate('/dashboard/courses');
        })
        .catch(err => toast.error(getErrorMessage(err)));
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading excellence...</div>;

  return (
    <div className="min-h-screen space-y-8 p-4 lg:p-8">
      {/* --- TOP NAVIGATION --- */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>

      {course && (
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* --- LEFT: COURSE HERO CARD --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="relative h-64 w-full overflow-hidden sm:h-80">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={course.imageUrl}
                  alt={course.courseName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{course.courseName}</h1>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/5 pb-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                      <IndianRupee size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Course Fee</p>
                      <p className="text-xl font-bold text-white">₹{course.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</p>
                      <p className="text-sm font-medium text-slate-200">
                        {course.startingDate} — {course.endDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">Course Syllabus & Description</h3>
                  <p className="leading-relaxed text-slate-400">
                    {course.description || "No description provided for this course."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: ACTIONS & QUICK STATS --- */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Management</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/dashboard/update-course/' + course._id, { state: { course } })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white transition-all hover:bg-violet-500 active:scale-[0.98]"
                >
                  <Edit3 size={18} /> Edit Course
                </button>
                <button 
                  onClick={() => deleteCourse(course._id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 font-semibold text-rose-500 transition-all hover:bg-rose-500/10 active:scale-[0.98]"
                >
                  <Trash2 size={18} /> Delete Course
                </button>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-4 text-blue-400">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{studentList?.length || 0}</p>
                  <p className="text-sm text-slate-500">Active Students Enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STUDENT LIST SECTION --- */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="border-b border-white/10 px-8 py-6">
          <h3 className="text-xl font-bold text-white">Enrolled Students</h3>
          <p className="text-sm text-slate-400">Manage and view all students currently in this course.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-8 py-4">Student Profile</th>
                <th className="px-8 py-4">Contact Information</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {studentList && studentList.map((student) => (
                <tr 
                  key={student._id} 
                  className="group cursor-pointer transition-colors hover:bg-white/[0.03]"
                  onClick={() => navigate('/dashboard/student-detail/' + student._id)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img 
                        className="h-12 w-12 rounded-full border-2 border-white/10 object-cover" 
                        src={student.imageUrl} 
                        alt="student profile" 
                      />
                      <span className="font-semibold text-slate-200 group-hover:text-violet-400 transition-colors">
                        {student.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Mail size={14} className="text-slate-600" /> {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Phone size={14} className="text-slate-600" /> {student.phone}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                      <ChevronRight size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!studentList || studentList.length === 0) && (
            <div className="py-20 text-center text-slate-500">
              No students enrolled in this course yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;