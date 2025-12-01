import React, { useState } from 'react'
import '../components/style.css'
import logo from '../assets/logoo.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";



const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading,setLoading]=useState(false);
  const navigate=useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('image', image);
    axios.post('http://localhost:8020/user/signup', formData)
      .then(res => {
        setLoading(false);
        toast.success('Signup Successfully create');
        navigate('/login');
        console.log(res);
      })
      .catch(err => {
         setLoading(false);
         toast.error('something is wrong')
        console.log(err);
      })
  }
  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }
  return (
    <div className='signup-wrapper'>
      <div className='signup-box'>
        <div className='signup-left'>
          <img src={logo} alt="book logo" />
          <h1 className='signup-left-heading'>Learning Management System</h1>
          <p className='signup-left-para'>Manage Your All data in easy way...</p>

        </div>


        <div className='signup-right'>
          <form onSubmit={submitHandler} className='signup-form'>
            <h1>Create Your Account</h1>
            <input required type='text' onChange={e => { setFullName(e.target.value) }} placeholder='Institute  Full Name' />
            <input required type='email' onChange={e => { setEmail(e.target.value) }} placeholder='Email' />
            <input required type='text' onChange={e => { setPhone(e.target.value) }} placeholder='Phone' />
            <input required type='password' onChange={e => { setPassword(e.target.value) }} placeholder='Password' />
            <input required onChange={fileHandler} type='file' />
            {imageUrl && <img className='your-logo' alt='Your logo' src={imageUrl} />}
            <button type='submit'>{ isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
            <Link className='link' to='/login'>Login with Your Account</Link>
          </form>

        </div>

      </div>
    </div>
  )
}

export default Signup;
