import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddStudents = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [courseId, setCourseId] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState('');
  const [courseList, setCourseList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
    if (location.state) {
      setFullName(location.state.student.fullName);
      setEmail(location.state.student.email);
      setPhone(location.state.student.phone);
      setAddress(location.state.student.address);
      setCourseId(location.state.student.courseId);
      setImageUrl(location.state.student.imageUrl);
    }
    else {
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCourseId('');
      setImageUrl('');
    }
  }, [location])
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
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('courseId', courseId);

    if (image) {
      formData.append('image', image);
    }
    if (location.state) {
      axios.put('http://localhost:8020/student/' + location.state.student._id, formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success('student detail updated Successfully');
          navigate('/dashboard/student-detail/' + location.state.student._id);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          toast.error('something is wrong...');
        })
    }
    else {
      axios.post('http://localhost:8020/student/add-student', formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => {
          setLoading(false);
          console.log(res.data);
          toast.success(' new student added Successfully');
          navigate('/dashboard/course-detail/'+courseId);
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
