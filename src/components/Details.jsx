import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';

const StudentDetail = () => {

  const [student, setStudent] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [course, setCourse] = useState({});

  const params = useParams()
  const navigate = useNavigate();

  function getStudentDetail() {
    api.get('/student/student-detail/' + params.id)
      .then(res => {
        console.log(res.data);
        setStudent(res.data.studentDetail);
        setPaymentList(res.data.feeDetail);
        setCourse(res.data.courseDetail);

      })
      .catch(err => {

        console.log(err);
        toast.error(getErrorMessage(err));
      })
  }

  useEffect(() => {
    getStudentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])
   const deleteStudent=(studentId)=>{
        if(window.confirm('Are you sure you want to delete this course?')){
api.delete('/student/'+studentId)
            .then(res => {
                console.log(res.data);
            navigate('/dashboard/course-detail/'+course._id);
            toast.success('student  data deleted successfully...');
            })
            .catch(err => {

                console.log(err);
                toast.error(getErrorMessage(err));
            })
        }
    }

  return (
    <div className='student-detail-main-wrapper'>

      <div className='student-detail-wrapper'>
        <div className='student-detail-header'>
          <h2>Student Full Detail</h2>
          <div className='student-detail-btn'>
            <button className='btn btn-primary' onClick={() => { navigate('/dashboard/update-student/' + student._id, { state: { student } }) }}>
              <i className="fa-solid fa-pen-to-square"></i>
              Edit
            </button>
            <button className='btn btn-danger' onClick={()=>{deleteStudent(student._id)}}>
              <i className="fa-solid fa-trash"></i>
              Delete
            </button>
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
      <br />
      <br />
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
