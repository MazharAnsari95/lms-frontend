import React, { useState } from 'react'

const AddCourses = () => {
  const [courseName,setCourseName]=useState('');
  const [description,setDescription]=useState('');
  const [price,setPrice]=useState(0);
  const [startingDate,setStartingDate]=useState('');
  const [endDate,setEndDate]=useState('');
  const [image,setImage]=useState(null);
  
  const [imageUrl,setImageUrl]=useState('');
  const [isLoading,setLoading]=useState('');


  const submitHandler =(e)=>{
    e.preventDefault();
 console.log(courseName,description,price,startingDate,endDate,image);
  }

    const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>Add New Course</h1>
        <input onChange={e=>{setCourseName(e.target.value)}} placeholder='Course Name' type='text'/>
        <input onChange={e=>{setDescription(e.target.value)}} placeholder='Description' type='text'/>
        <input onChange={e=>{setPrice(e.target.value)}} placeholder='Price' type='number'/>
        <input onChange={e=>{setStartingDate(e.target.value)}} placeholder='Starting Date (DD-MM-YY)' type='text'/>
        <input onChange={e=>{setEndDate(e.target.value)}} placeholder='End Date (DD-MM-YY)' type='text'/>
        <input  onChange={fileHandler} type='file'/>
        {imageUrl && <img className='your-logo' alt='Your logo' src={imageUrl} />}
        <button type='submit' className='submit-btn'>Submit</button>
      </form>
    </div>
  )
}

export default AddCourses
