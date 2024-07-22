import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { deleteUser, updateUser } from '../controllers/user.js'

const router = express.Router()


// router.post('/signup' , signUp)

router.put('/update/:id' , verifyToken , updateUser)
router.delete('/delete/:id' , verifyToken , deleteUser)



export default router