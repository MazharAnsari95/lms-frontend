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
    axios.post('http://localhost:8020/user/login', {
      email: email,
      password: password
    })
      .then(res => {
        setLoading(false);
        navigate('/dashboard');
        console.log(res);
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
          <h1 className='signup-left-heading'>Learning Management System</h1>
          <p className='signup-left-para'>Manage Your All data in easy way...</p>

        </div>


        <div className='signup-right'>
          <form onSubmit={submitHandler} className='signup-form'>
            <h1>Login with Your Account</h1>
            <input required type='email' onChange={e => { setEmail(e.target.value) }} placeholder='Email' />
            <input required type='password' onChange={e => { setPassword(e.target.value) }} placeholder='Password' />
            <button type='submit'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
            <Link className='link' to='/signup'>Create Your Account</Link>
          </form>

        </div>

      </div>
    </div>
  )
}

export default Login;
