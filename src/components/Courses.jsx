import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Courses = () => {
  const [courseList, setCourseList] = useState([]);

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
  return (
    <div className='course-wrapper'>
      {
        courseList.map((course) => (
          <div className='course-box' key={course._id}>
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
