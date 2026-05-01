import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserPlus, 
  UserCircle, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Upload, 
  Loader2, 
  ArrowLeft,
  Save
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const AddStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingStudent = location.state?.student;

  const [fullName, setFullName] = useState(editingStudent?.fullName || '');
  const [phone, setPhone] = useState(editingStudent?.phone || '');
  const [email, setEmail] = useState(editingStudent?.email || '');
  const [address, setAddress] = useState(editingStudent?.address || '');
  const [courseId, setCourseId] = useState(editingStudent?.courseId || '');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(editingStudent?.imageUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    api.get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then(res => setCourseList(res.data.courses || res.data.Courses || []))
      .catch(err => toast.error(getErrorMessage(err)));
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!courseId) return toast.warning("Please select a course");

    setIsLoading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('courseId', courseId);
    if (image) formData.append('image', image);

    const request = editingStudent 
      ? api.put(`/student/${editingStudent._id}`, formData)
      : api.post('/student/add-student', formData);

    request
      .then(() => {
        toast.success(editingStudent ? 'Profile updated!' : 'Student enrolled successfully!');
        navigate(editingStudent ? `/dashboard/student-detail/${editingStudent._id}` : `/dashboard/course-detail/${courseId}`);
      })
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen space-y-8 p-4 lg:p-8 max-w-6xl mx-auto">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {editingStudent ? 'Update Profile' : 'Student Enrollment'}
            </h1>
            <p className="text-sm text-slate-400">Manage student records and course assignments.</p>
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler} className="grid gap-8 lg:grid-cols-3">
        
        {/* --- LEFT: AVATAR & ENROLLMENT --- */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="relative mx-auto h-32 w-32 mb-6">
              <div className="h-full w-full rounded-full border-4 border-violet-500/30 overflow-hidden bg-slate-800">
                {imageUrl ? (
                  <img src={imageUrl} alt="student" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-full w-full text-slate-700 p-2" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-600 text-white cursor-pointer hover:bg-violet-500 shadow-xl transition-all">
                <Upload size={16} />
                <input type="file" className="hidden" onChange={fileHandler} accept="image/*" required={!editingStudent} />
              </label>
            </div>
            <h3 className="text-white font-semibold">{fullName || 'New Student'}</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Profile Photo</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <label className="block text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-violet-400" /> Assigned Course
            </label>
            <select 
              disabled={!!editingStudent}
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 transition-all outline-none disabled:opacity-50"
            >
              <option value="">Select a Course</option>
              {courseList.map((course) => (
                <option key={course._id} value={course._id}>{course.courseName}</option>
              ))}
            </select>
            {editingStudent && <p className="mt-2 text-[10px] text-slate-500 italic">Course cannot be changed during profile update.</p>}
          </div>
        </div>

        {/* --- RIGHT: PERSONAL DETAILS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-violet-400" /> Personal Information
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    value={fullName} required onChange={(e) => setFullName(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 transition-all outline-none"
                    placeholder="Enter student's full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    value={phone} required onChange={(e) => setPhone(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 transition-all outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" value={email} required onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 transition-all outline-none"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-600" size={18} />
                  <textarea 
                    value={address} required onChange={(e) => setAddress(e.target.value)} 
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 transition-all outline-none resize-none"
                    placeholder="Street name, City, State, Zip"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-4 border-t border-white/5 pt-8">
              <button 
                type="button" onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                disabled={isLoading}
                type="submit" 
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-violet-900/20"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingStudent ? 'Update Details' : 'Enroll Student'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudents;