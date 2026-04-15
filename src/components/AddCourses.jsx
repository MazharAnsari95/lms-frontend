import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

const AddCourses = () => {
  const location = useLocation();
  const editingCourse = location.state?.course;

  const [courseName, setCourseName] = useState(editingCourse?.courseName || '');
  const [description, setDescription] = useState(editingCourse?.description || '');
  const [price, setPrice] = useState(editingCourse?.price || 0);
  const [startingDate, setStartingDate] = useState(editingCourse?.startingDate || '');
  const [endDate, setEndDate] = useState(editingCourse?.endDate || '');
  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState(editingCourse?.imageUrl || '');
  const [isLoading, setLoading] = useState('');
  const navigate = useNavigate();


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
      const startISO = new Date(startingDate).toISOString();
  const endISO = new Date(endDate).toISOString();
    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startingDate', startISO);
    formData.append('endDate', endISO);

    if(image)
    {
      formData.append('image', image);
    }

    if (location.state) {
      api.put('/course/' + location.state.course._id, formData)
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success(' new Course updated Successfully');
          navigate('/dashboard/course-detail/' + location.state.course._id);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          toast.error(getErrorMessage(err));
        })
    }
    else{
 api.post('/course/add-course', formData)
      .then(res => {
        setLoading(false);
        console.log(res.data);
        toast.success(' new Course Added Successfully');
        navigate('/dashboard/courses');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        toast.error(getErrorMessage(err));
      })
    }
   
  }

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>{location.state ? 'Edit Course' : 'Add New Course'}</h1>
        <input value={courseName} required onChange={e => { setCourseName(e.target.value) }} placeholder='Course Name' type='text' />
        <input value={description} required onChange={e => { setDescription(e.target.value) }} placeholder='Description' type='text' />
        <input value={price} required onChange={e => { setPrice(e.target.value) }} placeholder='Price' type='number' />
        <input value={startingDate} required onChange={e => { setStartingDate(e.target.value) }} placeholder='Starting Date (DD-MM-YY)' type='text' />
        <input value={endDate} required onChange={e => { setEndDate(e.target.value) }} placeholder='End Date (DD-MM-YY)' type='text' />
        <input required={!location.state} onChange={fileHandler} type='file' />
        {imageUrl && <img className='your-logo' alt='Your logo' src={imageUrl} />}
        <button type='submit' className='submit-btn'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
      </form>
    </div>
  )
}

export default AddCourses
