import React from 'react'
import {GoogleAuthProvider, signInWithPopup , getAuth} from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import toast  from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'


const OAuth = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {

            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth , provider)
            // console.log(result);
            const res = await axios.post('http://localhost:4000/api/v1/auth/google' , {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            } , {
                headers: {
                    "Content-Type": "application/json"
                }
            } )

            // console.log(res)

            dispatch(signInSuccess(res.data))
            toast.success(res.data.message)

            navigate('/')


        } catch (error) {
            console.log("could not login with google" , error)
            toast.error(error.res.data.message)
            
                // console.log("could not login with google", error.message, error.code, error.stack);
              
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95' >
      Continue with google
    </button>
  )
}

export default OAuth
