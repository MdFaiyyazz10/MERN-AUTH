import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import toast  from 'react-hot-toast';
import axios from 'axios'
import OAuth from '../components/OAuth';

const SignUp = () => {

  const [formData , setFormData] = useState({});
  const [error , setError] = useState(false);
  const [loading , setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    // e.preventDefault()
    setFormData({...formData , 
      [e.target.id]: e.target.value}
    )  
  //  console.log(formData)
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    // console.log(formData); // Log the formData object
  
    const res = await axios.post('http://localhost:4000/api/v1/auth/signup', formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      console.log(response)
      toast.success(response.data.message)
      setFormData("")

      setLoading(false)
      // setError(false)
      navigate('/sign-in')

      if(response.data.success === false){
        // console.log(response)
        setError(true)
        return;
      }
     
    }).catch((error) => {
      console.error(error);
      toast.error(error.response.data.message)
      setError(true)
      setLoading(false)
    })
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className=' flex flex-col gap-4 ' onSubmit={submitHandler} >
        <input type="text" placeholder='Username' id='username' className='bg-slate-100  p-3 rounded-lg' onChange={handleChange} />
        <input type="email" placeholder='E-mail' id='email' className='bg-slate-100  p-3 rounded-lg' onChange={handleChange} />
        <input type="password" placeholder='Password' id='password' className='bg-slate-100  p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? 'Loading...' : 'Sign Up'}</button>
        
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account ?</p>
        <Link to={'/sign-in'}>
        <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went Wrong'}</p>
    </div>
  )
}

export default SignUp
