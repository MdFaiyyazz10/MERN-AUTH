import bcryptjs from 'bcryptjs'
import { User } from '../model/user.js'
import { ErrorHandler } from '../utils/error.js'



//update user
export const updateUser = async (req,res,next) => {
    if (req.user.id !== req.params.id) return res.status(401).json({success: false , message: "You can update only Your Account!"})

    try {
        if(req.body.password){
            req.body.password =  bcryptjs.hashSync(req.body.password , 10)
        }

        const validUser = await User.findByIdAndUpdate(req.params.id , {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        } , {new: true})

        res.status(200).json({success: true , message: "User Updated Successfully" , validUser})
        
    } catch (error) {
        next(error)
    }
    
    
}


export const deleteUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) {
        return next(ErrorHandler(401 , "You can delete only your account !"))
    }

    try {

        await User.findByIdAndDelete(req.params.id)
         return next(ErrorHandler(200 , "User deleted Successfully"));
        
    } catch (error) {
        next(error)
    }
}