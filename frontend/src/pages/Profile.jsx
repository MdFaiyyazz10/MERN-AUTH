import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'; 
import { updateUserFailed, updateUserStart, updateUserSuccess , deleteUserStart , deleteUserSuccess , deleteUserFailed, signOut } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';

const Profile = () => {

  const fileRef = useRef(null);
  const [image , setImage] = useState(undefined)
  const [imagePercent , setImagePercent] = useState(0);
  const [imageError , setImageError] = useState(false);

  const [formData , setFormData] = useState({})
  const [updateSuccess , setUpdateSuccess] = useState(false)


  // api calling

  const dispatch = useDispatch()

  // console.log(imagePercent)

  // console.log(image)
  
  const {currentUser , error , loading} = useSelector((state) => state.user);
  console.log(currentUser.validUser.profilePicture)
  // console.log(currentUser)

  // const {validUser} = currentUser
  // console.log(validUser)
  // const user = currentUser.data.validUser
  // console.log(user)

  //FireBase Image storage rules
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')


  useEffect(() => {
    if(image){
      handleImageUpload(image)
    }
   
  }, [image])


  const handleImageUpload = async (image) => {
    // console.log(image)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage , fileName)
    const uploadTask = uploadBytesResumable(storageRef , image)

    uploadTask.on('state_changed' , (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("upload is " + progress + "% done")
      setImagePercent(Math.round(progress))
    },

    (error) => {
      setImageError(true)
    } ,

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setFormData({...formData , profilePicture: downloadUrl})
      })
    })


  }
  
  // console.log(formData)


  // Api CAll for updation

  const handleChange = async (e) => {
    setFormData({
      ...formData , 
      [e.target.id ]: e.target.value,
    })

    // console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(user._id)
    try {  
      dispatch(updateUserStart())

      // const res = await axios.put(`http://localhost:4000/api/v1/user/update/${currentUser.data.validUser._id}`, formData, {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "application/json" , 
      //   }
      // console.log(currentUser)
      const token = currentUser.token;
      // console.log(token)
      // console.log(currentUser.validUser._id)
      const res = await fetch(`http://localhost:4000/api/v1/user/update/${currentUser.validUser._id}` , {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include token
        },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      console.log(data)

      if(data.success === false) {
        dispatch(updateUserFailed(data))
        return ;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

      toast.success(data.message)
     
      
      
      
    }catch(error) {
      // console.error(error);
      dispatch(updateUserFailed(error))
      console.log(error.message)
      toast.error(error.message)
      // toast.error(error.response.data.message)
     
    }
    
  }
  

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserFailed())
      const token = currentUser.token;
      const res = await fetch(`http://localhost:4000/api/v1/user/delete/${currentUser.validUser._id}` , {
        method: "DELETE" ,  
        headers: {
          "Authorization": `Bearer ${token}` // Add the token here
        }
      })

      const data = await res.json()
      console.log(data)

      if(data.success === false) {
        dispatch(deleteUserFailed(data))
        return;
      }

      toast.success(data.message)

      dispatch(deleteUserSuccess(data))
    } catch (error) {
      // console.log(error)
      
      dispatch(deleteUserFailed(error))
      toast.error(error.message)
    }
  } 


  const handleSignOut = async() => {
    try {
      dispatch(signOut())
      const res = await fetch(`http://localhost:4000/api/v1/auth/signout`);
      const data = await res.json()
      console.log(data)

      toast.success(data.message)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7' >Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >

        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />

        <img className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' src={formData.profilePicture || currentUser.validUser.profilePicture} alt={currentUser.validUser.username} onClick={() => fileRef.current.click()} />

        <p className='text-sm self-center'>
          {
            imageError ? (
              <span className='text-red-700'>Error while uploading image (file size must be less than 2mb)</span> ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className='text-slate-700'>{`Uploading: ${imagePercent} % `}</span> ) : imagePercent === 100 ? (
                  <span className='text-green-700 '>Image uploaded successfully</span> ) : (
                    ""
                  )}
        </p>


        <input  defaultValue={currentUser.validUser.username} type="text" id='username' placeholder='Username' className='bg-slate-100 rounded-lg p-3' />
        <input defaultValue={currentUser.validUser.email} type="email" id='email' placeholder='E-mail' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input   type="password" id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? 'Loading...' : 'update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount} >Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error && "Something went Wrong" }</p>
      <p className='text-green-700 mt-5'>{updateSuccess && "User  Updated Succesfully" }</p>
    </div>
  )
}

export default Profile
