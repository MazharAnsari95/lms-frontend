import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

const AddStudents = () => {
  const location = useLocation();
  const editingStudent = location.state?.student;

  const [fullName, setFullName] = useState(editingStudent?.fullName || '');
  const [phone, setPhone] = useState(editingStudent?.phone || '');
  const [email, setEmail] = useState(editingStudent?.email || '');
  const [address, setAddress] = useState(editingStudent?.address || '');
  const [courseId, setCourseId] = useState(editingStudent?.courseId || '');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(editingStudent?.imageUrl || '');
  const [isLoading, setLoading] = useState('');
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

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
    getCourses();
  }, [])


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('courseId', courseId);

    if (image) {
      formData.append('image', image);
    }
    if (location.state) {
      api.put('/student/' + location.state.student._id, formData)
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success('student detail updated Successfully');
          navigate('/dashboard/student-detail/' + location.state.student._id);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          toast.error(getErrorMessage(err));
        })
    }
    else {
      api.post('/student/add-student', formData)
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success(' new student added Successfully');
          navigate('/dashboard/course-detail/'+courseId);
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
        <h1>{location.state ? 'Edit Student  Detail' : 'Add New Student'}</h1>
        <input value={fullName} onChange={(e) => { setFullName(e.target.value) }} placeholder='Student Name' />
        <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder='Phone Number' />
        <input value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
        <input value={address} onChange={(e) => { setAddress(e.target.value) }} placeholder=' Full Address' />
        <select disabled={location.state} value={courseId} onChange={(e) => { setCourseId(e.target.value) }}>
          <option>Select Course</option>
          {
            courseList.map((course) => (
              <option value={course._id}>{course.courseName}</option>
            ))
          }
        </select>
        <input required={!location.state} onChange={fileHandler} type='file' />
        {imageUrl && <img className='your-logo' alt='student-pic' src={imageUrl} />}
        <button type='submit' className='submit-btn'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
      </form>
    </div>
  )
}

export default AddStudents
