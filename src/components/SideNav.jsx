import React from 'react'
import '../components/style.css'
import logo from '../assets/logoo.png';
import { Link } from 'react-router-dom';

const SideNav = () => {
    return (
        <div className='nav-container'>
            <div className='brand-container'>
                <img className='profile-logo' src={logo} alt="brand-logo" />
                <div>
                    <h2 className='brand-name'>AIMT Management App</h2>
                    <p className='brand-slogon'>Manage Your App in easy way</p>
                </div>
            </div>
            <div className='menu-container'>
                <Link className='menu-link'><i className="fa-solid fa-house"></i> Home</Link>
                <Link className='menu-link'><i className="fa-solid fa-book"></i> All Course</Link>
                <Link className='menu-link'><i class="fa-sharp fa-solid fa-plus"></i> Add Courses</Link>
                <Link className='menu-link'><i class="fa-solid fa-user-group"></i> All Students</Link>
                <Link className='menu-link'><i class="fa-sharp fa-solid fa-plus"></i> Add Students</Link>
                <Link className='menu-link'><i class="fa-solid fa-money-bill"></i> Collect Fee</Link>
                <Link className='menu-link'> <i class="fa-solid fa-list"></i> Payment History</Link>


            </div>
            <div className='contact-us'>
                <p> <i class="fa-solid fa-address-book"></i>Contact Developer</p>
                <p><i class="fa-solid fa-phone"></i> 9661557369</p>
            </div>
        </div>
    )
}

export default SideNav
