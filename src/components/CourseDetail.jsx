import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '../lib/api';

const CourseDetail = () => {
    const params = useParams();
    const [course, setCourse] = useState(null);
    const [studentList, setStudentList] = useState([]);


    const navigate=useNavigate();


    function getCourseDetail() {
        api.get('/course/course-detail/' + params.id)
            .then(res => {
                console.log(res.data);
                console.log(res.data.course);
                console.log("Student List:", res.data.studentList);
                setCourse(res.data.course);
                setStudentList(res.data.studentList);




            })
            .catch(err => {

                console.log(err);
                toast.error(getErrorMessage(err));
            })
    }

    useEffect(() => {
        getCourseDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])
    const deleteCourse=(courseId)=>{
        if(window.confirm('Are you sure you want to delete this course?')){
api.delete('/course/'+courseId)
            .then(res => {
                console.log(res.data);
            navigate('/dashboard/courses');
            })
            .catch(err => {

                console.log(err);
                toast.error(getErrorMessage(err));
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
                                <button className='btn btn-primary' onClick={()=>{navigate('/dashboard/update-course/'+course._id,{state:{course}})}}>
                                  <i className="fa-solid fa-pen-to-square"></i>
                                  Edit
                                </button>
                                <button className='btn btn-danger' onClick={()=>{deleteCourse(course._id)}}>
                                  <i className="fa-solid fa-trash"></i>
                                  Delete
                                </button>
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
