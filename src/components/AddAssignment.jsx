import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';
import { 
  Calendar, 
  FileText, 
  BookOpen, 
  UploadCloud, 
  ArrowLeft, 
  Save, 
  Loader2,
  PlusCircle
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-[#1a1a1a]/50">
            <div className="flex items-center gap-3">
              <PlusCircle className="text-indigo-500 w-6 h-6" />
              <h1 className="text-2xl font-semibold tracking-tight">
                {editing ? 'Edit Assignment' : 'New Assignment'}
              </h1>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Configure the assignment details and resources for your students.
            </p>
          </div>

          <form onSubmit={submit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Assignment Title</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter descriptive title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Select Course</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <select
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white appearance-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                  >
                    <option value="" className="bg-[#141414]">Choose course...</option>
                    {courseList.map((c) => (
                      <option key={c._id} value={c._id} className="bg-[#141414]">{c.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all color-scheme-dark"
                    style={{ colorScheme: 'dark' }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Instructions</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                  placeholder="What should students know about this task?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* File Upload Area */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Reference Materials</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/5 border-dashed rounded-xl cursor-pointer bg-[#0a0a0a] hover:bg-[#1a1a1a] hover:border-indigo-500/40 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attachment ? attachment.name : 'PDF, DOCX up to 20MB'}
                    </p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editing ? 'Update Assignment' : 'Push Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}