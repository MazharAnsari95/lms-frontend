import React, { useState } from 'react'
import '../components/style.css'
import logo from '../assets/logoo.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";




const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    axios.post('https://lms-backend-3-uxht.onrender.com/user/login', {
      email: email,
      password: password
    })

      .then(res => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('fullName', res.data.fullName);
        localStorage.setItem('imageUrl', res.data.imageUrl);
        localStorage.setItem('imageId', res.data.imageId);
        localStorage.setItem('email', res.data.email);
        navigate('/dashboard');
        console.log(res.data); // check sab fields
      })


      .catch(err => {
        setLoading(false);
        toast.error('something is wrong')
        console.log(err);
      })
  }

  return (
    <div className='signup-wrapper'>
      <div className='signup-box'>
        <div className='signup-left'>
          <img src={logo} alt="book logo" />
          <h1 className='signup-left-heading'>Institute Management System</h1>
          <p className='signup-left-para'>Manage Your All data in easy way...</p>

        </div>


        <div className='signup-right'>
          <form onSubmit={submitHandler} className='form'>
            <h1>Login with Your Account</h1>
            <input required type='email' onChange={e => { setEmail(e.target.value) }} placeholder='Email' />
            <input required type='password' onChange={e => { setPassword(e.target.value) }} placeholder='Password' />
            <button type='submit'>{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
            <Link className='link' to='/signup'>Create Your Account</Link>
          </form>

        </div>

      </div>
    </div>
  )
}

export default Login;
