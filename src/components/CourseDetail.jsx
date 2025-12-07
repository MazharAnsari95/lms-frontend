import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const CourseDetail = () => {
    const params = useParams();
    const [course, setCourse] = useState(null);
    const [studentList, setStudentList] = useState([]);


    const navigate=useNavigate();


    useEffect(() => {
        getCourseDetail()
    }, [])
    const getCourseDetail = () => {
        axios.get('http://localhost:8020/course/course-detail/' + params.id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
                console.log(res.data.course);
                console.log("Student List:", res.data.studentList);
                setCourse(res.data.course);
                setStudentList(res.data.studentList);




            })
            .catch(err => {

                console.log(err);
                toast.error('something is wrong...');
            })
    }
    const deleteCourse=(courseId)=>{
        if(window.confirm('Are you sure you want to delete this course?')){
axios.delete('http://localhost:8020/course/'+courseId, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
            navigate('/dashboard/courses');
            })
            .catch(err => {

                console.log(err);
                toast.error('something is wrong...');
            })
        }
    }

    return (
        <div className='course-detail-page'>
            {course && (
                <div className='course-detail-container'>

                    <div className='course-detail-main'>
                        <img
                            className='course-detail-image'
                            src={course.imageUrl}
                            alt='course-thumbnail'
                        />

                        <div className='course-detail-text'>
                            <h1 className='course-detail-title'>{course.courseName}</h1>
                            <p className='course-detail-price'>Price :- {course.price}</p>
                            <p className='course-detail-price'>Starting Date :- {course.startingDate}</p>
                            <p className='course-detail-price'>End Date :- {course.endDate}</p>
                        </div>
                        <div className='course-des'>
                            <div className='edit-delete'>
                                <button className='primary-btn' onClick={()=>{navigate('/dashboard/update-course/'+course._id,{state:{course}})}}>Edit</button>
                                <button className='secondary-btn' onClick={()=>{deleteCourse(course._id)}}>Delete</button>
                            </div>
                            <h3 className='des'>Course Description</h3>
                            <div>
                                <div>  
                                <p className='course-detail-description'>
                                    {course.description}
                             
                                    
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {studentList && studentList.length > 0 &&
                <div className='studentlist-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Student's Pic</th>
                                <th>Student Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.map((student) => (
                                <tr onClick={()=>{navigate('/dashboard/student-detail/'+student._id)}} key={student._id} className='student-row'>
                                    <td><img className='student-profile-pic' alt='student pic' src={student.imageUrl} /></td>
                                    <td><p>{student.fullName}</p></td>
                                    <td> <p>{student.phone}</p></td>
                                    <td><p>{student.email}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }


        </div>
    )
}

export default CourseDetail;
