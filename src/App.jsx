import React from 'react'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import 'react-toastify/dist/ReactToastify.css';
import AddCourses from './components/AddCourses';
import Courses from './components/Courses';
import Home from './components/Home';
import Students from './components/Students';
import AddStudent from './components/AddStudent';
import CollectFess from './components/CollectFess';
import PaymentHistory from './components/PaymentHistory';
import CourseDetail from './components/CourseDetail';
// import StudentDetail from './components/Studentdetail';




const App = () => {
  const myRouter = createBrowserRouter([
    { path: '', Component: Login },
    { path: 'login', Component: Login },
    { path: 'signup', Component: Signup },
    {
      path: 'dashboard', Component: Dashboard, children: [
        { path: '', Component: Home },
        { path: 'home', Component: Home },
        { path: 'courses', Component: Courses },
        { path: 'add-course', Component: AddCourses },
        { path: 'students', Component: Students },
        { path: 'add-student', Component: AddStudent },
        { path: 'collect-fee', Component: CollectFess },
        { path: 'payment-history', Component: PaymentHistory},
        { path: 'course-detail/:id', Component: CourseDetail},
        { path: 'update-course/:id', Component: AddCourses},
        { path: 'update-student/:id', Component: AddStudent},
        // { path: 'student-detail/:id', Component: StudentDetail}


      ]
    }
  ])
  return (
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </>
  )
}

export default App;
