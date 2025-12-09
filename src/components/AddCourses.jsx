import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCourses = () => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [startingDate, setStartingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('hi')
    if (location.state) {
      console.log(location.state.course);
      setCourseName(location.state.course.courseName)
      setDescription(location.state.course.description);
      setPrice(location.state.course.price);
      setStartingDate(location.state.course.startingDate);
      setEndDate(location.state.course.endDate);
      setImageUrl(location.state.course.imageUrl);
    }
    else{
      setCourseName('')
      setDescription('');
      setPrice(0);
      setStartingDate('');
      setEndDate('');
      setImageUrl('');
    }
  }, [location])


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startingDate', startingDate);
    formData.append('endDate', endDate);

    if(image)
    {
      formData.append('image', image);
    }

    if (location.state) {
      axios.put('https://lms-backend-3-uxht.onrender.com/course/' + location.state.course._id, formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success(' new Course updated Successfully');
          navigate('/dashboard/course-detail/' + location.state.course._id);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          toast.error('something is wrong...');
        })
    }
    else{
 axios.post('https://lms-backend-3-uxht.onrender.com/course/add-course', formData, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        setLoading(false);
        console.log(res.data);
        toast.success(' new Course Added Successfully');
        navigate('/dashboard/courses');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        toast.error('something is wrong...');
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
