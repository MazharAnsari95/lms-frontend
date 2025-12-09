import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const naviagte=useNavigate();

  useEffect(() => {
    getCourses()
  },[])
  const getCourses = () => {
    axios.get('https://lms-backend-3-uxht.onrender.com/course/all-courses', {
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
  return (
    <div className='course-wrapper'>
      {
        courseList.map((course) => (
          <div  onClick={()=>{naviagte('/dashboard/course-detail/'+course._id)}}className='course-box' key={course._id}>
            <img alt='thumbnail' className='course-thumbnail' src={course.imageUrl}/>
            <h2 className='course-title'>{course.courseName}</h2>
            <p className='course-price'> Rs. {course.price} only </p>
          </div>
        ))
      }
    </div>
  )
}

export default Courses
