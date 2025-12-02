import React from 'react'
import '../components/style.css'
import logo from '../assets/logoo.png';
import SideNav from './SideNav';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className='dashboard-main-container'>
      <div className='dashboard-container'>
       <SideNav/>
        <div className='main-container'>
          <div className='top-bar'>

            <div className='logo-container'>
           <img  className='profile-logo' src={logo} alt="profile logo" />
            </div>
            <div className='profile-container'>
              <h2 className='profile-name'>AIMT College</h2>
              <button className='logout-btn'>Logout</button>
            </div>
          </div>


          <Outlet/>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
