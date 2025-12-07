import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const StudentDetail = () => {

  const [student, setStudent] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [course, setCourse] = useState({});

  const params = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    getStudentDetail();
  }, [])
  const getStudentDetail = () => {
    axios.get('http://localhost:8020/student/student-detail/' + params.id, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res.data);
        setStudent(res.data.studentDetail);
        setPaymentList(res.data.feeDetail);
        setCourse(res.data.courseDetail);

      })
      .catch(err => {

        console.log(err);
        toast.error('something is wrong...');
      })
  }
   const deleteStudent=(studentId)=>{
        if(window.confirm('Are you sure you want to delete this course?')){
axios.delete('http://localhost:8020/student/'+studentId, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
            navigate('/dashboard/course-detail/'+course._id);
            toast.success('student  data deleted successfully...');
            })
            .catch(err => {

                console.log(err);
                toast.error('something is wrong...');
            })
        }
    }

  return (
    <div className='student-detail-main-wrapper'>

      <div className='student-detail-wrapper'>
        <div className='student-detail-header'>
          <h2>Student Full Detail</h2>
          <div className='student-detail-btn'>
            <button className='primary-btn' onClick={() => { navigate('/dashboard/update-student/' + student._id, { state: { student } }) }}>Edit</button>
            <button className='secondary-btn' onClick={()=>{deleteStudent(student._id)}}>Delete</button>
          </div>
        </div>

        <div className='sd-detail'>
          <img alt='student pic' src={student.imageUrl} />
          <div>
            <h1>{student.fullName}</h1>
            <p>Phone :- {student.phone}</p>
            <p>Email :- {student.email}</p>
            <p>Address :- {student.address}</p>
            <h4>Course Name:- {course.courseName}</h4>
          </div>

        </div>
        <div>

        </div>
      </div>
      <br />
      <h2 className='payment-history-title'>payment History</h2>
      <div className='fee-detail-wrapper'>
        <table>
          <thead>
            <th>Date and Time</th>
            <th>Amount</th>
            <th>Remark</th>
          </thead>
          <tbody>
            {
              paymentList.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.
                    createdAt}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.remark}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default StudentDetail;
