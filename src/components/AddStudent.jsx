import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddStudents = () => {
 
  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState('');
  const [courseList, setCourseList] = useState([]);
  const navigate=useNavigate();
  
   useEffect(() => {
    getCourses()
  },[])
  const getCourses = () => {
    axios.get('http://localhost:8020/course/all-courses', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res.data.courses);
       
        // setCourseList(res.data.Courses);
        setCourseList(res.data.courses || res.data.Courses || []);


      })
      .catch(err => {

        console.log(err);
        toast.error('something is wrong...');
      })
  }


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    
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
        <h1>Add New Student</h1>
        <input  placeholder='Student Name'/>
        <input  placeholder='Phone Number'/>
        <input  placeholder='Email'/>
        <input  placeholder=' Full Address'/>
        <select> 
          <option>Select Course</option>
          {
            courseList.map((course)=>(
              <option>{course.courseName}</option>
            ))
          }
        </select>
        <input required onChange={fileHandler} type='file' />
        {imageUrl && <img className='your-logo' alt='Your logo' src={imageUrl} />}
        <button type='submit' className='submit-btn'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
      </form>
    </div>
  )
}

export default AddStudents
