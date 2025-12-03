import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
  const navigate=useNavigate();


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startingDate', startingDate);
    formData.append('endDate', endDate);
    formData.append('image', image);
    axios.post('http://localhost:8020/course/add-course', formData, {
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

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>Add New Course</h1>
        <input required onChange={e => { setCourseName(e.target.value) }} placeholder='Course Name' type='text' />
        <input required onChange={e => { setDescription(e.target.value) }} placeholder='Description' type='text' />
        <input required onChange={e => { setPrice(e.target.value) }} placeholder='Price' type='number' />
        <input required onChange={e => { setStartingDate(e.target.value) }} placeholder='Starting Date (DD-MM-YY)' type='text' />
        <input required onChange={e => { setEndDate(e.target.value) }} placeholder='End Date (DD-MM-YY)' type='text' />
        <input required onChange={fileHandler} type='file' />
        {imageUrl && <img className='your-logo' alt='Your logo' src={imageUrl} />}
        <button type='submit' className='submit-btn'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
      </form>
    </div>
  )
}

export default AddCourses
