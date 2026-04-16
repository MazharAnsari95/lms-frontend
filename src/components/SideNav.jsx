import React from 'react'
import '../components/style.css'
import logo from '../assets/logoo.png';
import { Link, useLocation } from 'react-router-dom';

const SideNav = ({ navOpen, onClose }) => {
    const location = useLocation();
    return (
        <div className={navOpen ? 'nav-container nav-open' : 'nav-container'}>
            <div className='brand-container'>
                <img className='profile-logo' src={logo} alt="brand-logo" />
                <div>
                    <h2 className='brand-name'>AIMT Management App</h2>
                    <p className='brand-slogon'>Manage Your App in easy way</p>
                </div>
            </div>
            <div className='menu-container'>
                <Link onClick={onClose} to='/dashboard/home' className={location.pathname === '/dashboard/home' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-house"></i> Home</Link>
                <Link onClick={onClose} to='/dashboard/analytics' className={location.pathname === '/dashboard/analytics' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-chart-line"></i> Analytics</Link>
                <Link onClick={onClose} to='/dashboard/courses' className={location.pathname === '/dashboard/courses' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-book"></i> All Course</Link>
                <Link onClick={onClose} to='/dashboard/add-course' className={location.pathname === '/dashboard/add-course' ? 'menu-active-link' : 'menu-link'}><i className="fa-sharp fa-solid fa-plus"></i> Add Courses</Link>
                <Link onClick={onClose} to='/dashboard/students' className={location.pathname === '/dashboard/students' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-user-group"></i> All Students</Link>
                <Link onClick={onClose} to='/dashboard/add-student' className={location.pathname === '/dashboard/add-student' ? 'menu-active-link' : 'menu-link'}><i className="fa-sharp fa-solid fa-plus"></i> Add Students</Link>
                <Link onClick={onClose} to='/dashboard/attendance' className={location.pathname === '/dashboard/attendance' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-calendar-check"></i> Attendance</Link>
                <Link onClick={onClose} to='/dashboard/marksheet' className={location.pathname === '/dashboard/marksheet' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-file-lines"></i> Marksheet</Link>
                <Link onClick={onClose} to='/dashboard/assignments' className={location.pathname === '/dashboard/assignments' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-clipboard-list"></i> Assignments</Link>
                <Link onClick={onClose} to='/dashboard/collect-fee' className={location.pathname === '/dashboard/collect-fee' ? 'menu-active-link' : 'menu-link'}><i className="fa-solid fa-money-bill"></i> Collect Fee</Link>
                <Link onClick={onClose} to='/dashboard/payment-history' className={location.pathname === '/dashboard/payment-history' ? 'menu-active-link' : 'menu-link'}> <i className="fa-solid fa-list"></i> Payment History</Link>


            </div>
            <div className='contact-us'>
                <p> <i className="fa-solid fa-address-book"></i>Contact Developer</p>
                <p><i className="fa-solid fa-phone"></i> 9661557369</p>
            </div>
        </div>
    )
}

export default SideNav
