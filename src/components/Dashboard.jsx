import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import '../components/style.css'
import SideNav from './SideNav';
import { Outlet} from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
   const MotionDiv = motion.div;
   const navigate=useNavigate();
   const location = useLocation();
   const [navOpen, setNavOpen] = useState(false);
  const logoutHandler=()=>{
    localStorage.clear();
    navigate('/login');

  }
  return (
    <div className='app-shell'>
    <div className='dashboard-main-container'>
      {navOpen && <div className="nav-overlay" onClick={() => setNavOpen(false)} />}
      <div className='dashboard-container'>
       <SideNav navOpen={navOpen} onClose={() => setNavOpen(false)} />
        <div className='main-container'>
          <div className='top-bar'>
            <button className="nav-mobile-toggle" type="button" onClick={() => setNavOpen((v) => !v)}>
              <i className="fa-solid fa-bars"></i>
              Menu
            </button>

            <div className='logo-container'>
           <img  className='profile-logo' src={localStorage.getItem('imageUrl')} alt="profile logo" />
            </div>
            <div className='profile-container'>
              <h2 className='profile-name'>{localStorage.getItem('fullName')}</h2>
              <button className='logout-btn' onClick={logoutHandler}>Logout</button>
            </div>
          </div>


         <MotionDiv
           className='outlet-area'
           key={location.pathname}
           initial={{ opacity: 0, y: 8 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.2 }}
         >
           <Outlet/>
         </MotionDiv>
        </div>

      </div>
    </div>
    </div>
  )
}

export default Dashboard
