import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  Loader2, 
  ArrowLeft, 
  Save, 
  Info, 
  IndianRupee, 
  Calendar 
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';

const AddCourses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingCourse = location.state?.course;

  const [courseName, setCourseName] = useState(editingCourse?.courseName || '');
  const [description, setDescription] = useState(editingCourse?.description || '');
  const [price, setPrice] = useState(editingCourse?.price || 0);
  // Note: Backend likely expects YYYY-MM-DD for <input type="date" />
  const [startingDate, setStartingDate] = useState(editingCourse?.startingDate?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(editingCourse?.endDate?.split('T')[0] || '');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(editingCourse?.imageUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startingDate', new Date(startingDate).toISOString());
    formData.append('endDate', new Date(endDate).toISOString());

    if (image) formData.append('image', image);

    const request = editingCourse 
      ? api.put(`/course/${editingCourse._id}`, formData)
      : api.post('/course/add-course', formData);

    request
      .then(res => {
        toast.success(editingCourse ? 'Course updated successfully' : 'New course added successfully');
        navigate(editingCourse ? `/dashboard/course-detail/${editingCourse._id}` : '/dashboard/courses');
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
    <div className="min-h-screen space-y-8 p-4 lg:p-8 max-w-5xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-sm text-slate-400">Fill in the details to publish your course content.</p>
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler} className="grid gap-8 lg:grid-cols-3">
        
        {/* --- LEFT: MAIN DETAILS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
            <div className="flex items-center gap-2 text-violet-400 mb-2">
              <Info size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">General Information</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Course Title</label>
                <input 
                  value={courseName} 
                  required 
                  onChange={e => setCourseName(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  placeholder="e.g. Advanced React Architecture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Detailed Description</label>
                <textarea 
                  value={description} 
                  required 
                  rows={5}
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all resize-none"
                  placeholder="What will students learn in this course?"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-violet-400 mb-6">
              <Calendar size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Schedule & Pricing</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-400 mb-2">Price (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="number"
                    value={price} 
                    required 
                    onChange={e => setPrice(e.target.value)} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={startingDate} 
                    required 
                    onChange={e => setStartingDate(e.target.value)} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">End Date</label>
                  <input 
                    type="date"
                    value={endDate} 
                    required 
                    onChange={e => setEndDate(e.target.value)} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MEDIA & SUBMIT --- */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
             <div className="flex items-center gap-2 text-violet-400 mb-6">
              <ImageIcon size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Course Media</span>
            </div>

            <div className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-slate-900/50 overflow-hidden flex flex-col items-center justify-center group">
              {imageUrl ? (
                <>
                  <img className="h-full w-full object-cover" src={imageUrl} alt="Preview" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-950 px-4 py-2 rounded-lg font-bold text-sm">Change Image</label>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <PlusCircle className="mx-auto text-slate-600 mb-2" size={32} />
                  <p className="text-xs text-slate-500">Upload Thumbnail (16:9 recommended)</p>
                </div>
              )}
              <input 
                required={!editingCourse} 
                onChange={fileHandler} 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-violet-600/5 p-6 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              Make sure all details are correct. Once published, this course will be visible to all students.
            </p>
            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-violet-900/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {editingCourse ? 'Update Course' : 'Publish Course'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCourses;