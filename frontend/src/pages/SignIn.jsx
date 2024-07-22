import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import toast  from 'react-hot-toast';
import axios from 'axios'

// Redux
import {signInStart , signInSuccess , signInFailed} from '../redux/user/userSlice.js'
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';

const SignIn = () => {

  const [formData , setFormData] = useState({})
  // const [loading , setLoading] = useState(false)
  // const [error , setError] = useState(false)

  const {loading , error} = useSelector((state) => state.user);

  const navigate = useNavigate()

  const dispatch = useDispatch()

  
  const handleChange = (e) => {
    // e.preventDefault()
    setFormData({...formData , 
      [e.target.id]: e.target.value}
    )  
  //  console.log(formData)
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    // setLoading(true)
    dispatch(signInStart());
    // console.log(formData); // Log the formData object
  
    const res = await axios.post('http://localhost:4000/api/v1/auth/signin', formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      // console.log(response)
      toast.success(response.data.message)
      setFormData("")

      // setLoading(false)
      // setError(false)
      
      navigate('/')
      
      if(response.data.success === false){
        // console.log(response)
        // setError(true)
        dispatch(signInFailed(response.message))
        return;
      }
      
      dispatch(signInSuccess(response.data)) 
      
    }).catch((error) => {
      // console.error(error);
      toast.error(error.response.data.message)
      // setError(true)
      dispatch(signInFailed(error))
      // setLoading(false)
    })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form className=' flex flex-col gap-4 ' onSubmit={submitHandler} >
      <input type="email" placeholder='E-mail' id='email' className='bg-slate-100  p-3 rounded-lg' onChange={handleChange} />
      <input type="password" placeholder='Password' id='password' className='bg-slate-100  p-3 rounded-lg' onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? 'Loading...' : 'Sign In'}</button>
      <OAuth />
    </form>

    <div className='flex gap-2 mt-5'>
      <p>Don't have an account ?</p>
      <Link to={'/sign-up'}>
      <span className='text-blue-500'>Sign Up</span>
      </Link>
    </div>
    <p className='text-red-700 mt-5'>{error  && 'Something went Wrong'}</p>
  </div>
  )
}

export default SignIn
