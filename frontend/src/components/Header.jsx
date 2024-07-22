import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

const Header = () => {

  const {currentUser} = useSelector((state) => state.user)

  // console.log(currentUser.validUser.profilePicture)
  // console.log(validUser)

  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 '>

      <Link to={'/'}>
        <h1 className='font-bold'>Auth App</h1>
      </Link>

        <ul className='flex gap-4 cursor-pointer' >
          <Link to={'/'}> <li>Home</li> </Link>
          <Link to={'/about'}> <li>About</li> </Link>
          <Link to={'/profile'}> 
          {
            currentUser ? (
              <img className='h-7 w-7 rounded-full object-cover ' src={currentUser.validUser.profilePicture}  alt={currentUser.username} />
            ) : (
              <li>SignIn</li>
            )
          }
           </Link>
        </ul>
      </div>
    </div>
  )
}

export default Header
