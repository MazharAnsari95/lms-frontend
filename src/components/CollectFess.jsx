import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

const CollectFess = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  const navigate=useNavigate();






  function getCourses() {
    api.get('/course/all-courses', { params: { page: 1, limit: 100 } })
      .then(res => {
        console.log(res.data.courses);

        // setCourseList(res.data.Courses);
        setCourseList(res.data.courses || res.data.Courses || []);


      })
      .catch(err => {

        console.log(err);
        toast.error(getErrorMessage(err));
      })
  }

  useEffect(() => {
    getCourses()
  }, [])
  const submitHandler = (e) => {
    e.preventDefault();
    api.post('/fee/add-fee', {
      fullName: fullName,
      amount: amount,
      phone: phone,
      remark: remark,
      courseId: courseId
    })
      .then(res => {
        setLoading(false);
        console.log(res.data);
        toast.success(' fee paid.....');
        navigate('/dashboard/payment-history');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        toast.error(getErrorMessage(err));
      })
  }
  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>Collect Fee</h1>
        <input required type='text' onChange={e => { setFullName(e.target.value) }} placeholder='Full Name' />
        <input required type='text' onChange={e => { setPhone(e.target.value) }} placeholder='Phone' />
        <input required type='text' onChange={e => { setAmount(e.target.value) }} placeholder='Amount' />
        <input required type='text' onChange={e => { setRemark(e.target.value) }} placeholder='Remark' />
        <select value={courseId} onChange={(e) => { setCourseId(e.target.value) }}>
          <option>Select Course</option>
          {
            courseList.map((course) => (
              <option value={course._id}>{course.courseName}</option>
            ))
          }
        </select>
        <button type='submit'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>

      </form>
    </div>
  )
}

export default CollectFess
