import { User } from "../model/user.js"
import bcryptjs from 'bcryptjs'
import {ErrorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill the fields" });
      }
  
      const hashedPassword = bcryptjs.hashSync(password, 10);
  
      const prevUser = await User.findOne({ email });
  
      if (prevUser) {
        return res.status(400).json({ success: false, message: "User Already Exist" });
      }
  
      const user = await User.create({ username, email, password: hashedPassword });
  
      return res.status(201).json({ success: true, message: "User Registered Successfully", user });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
      // next(error)
    }
  }

  
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill the fields" });
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      // return res.status(400).json({ success: false, message: "User does'nt Exist" });
      return next(ErrorHandler(401 , "User Not Found"))
    }

    const validPassword = bcryptjs.compareSync(password , validUser.password)

    if(!validPassword) return next(ErrorHandler(401 , "Invalid Credentials"))

      // Token Generating

      const token =  jwt.sign({id: validUser._id} , process.env.JWT_SECRET)
      
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      return res.status(201).cookie('access_token' , token , {httpOnly: true , expires: expiryDate} ).json({ success: true, message: "User Logged In Successfully", validUser , token });


  } catch (error) {
    // return res.status(400).json({ success: false, message: error.message });
    next(error)
  }
}



export const google = async (req,res,next) => {
  try {

    const validUser = await User.findOne({email: req.body.email});

    if(validUser){
      const token = jwt.sign({id: validUser._id} , process.env.JWT_SECRET)

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      return res.status(201).cookie('access_token' , token , {httpOnly: true , expires: expiryDate} ).json({ success: true, message: "User Logged In Successfully", validUser , token });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)

      const hashedPassword = bcryptjs.hashSync(generatedPassword , 10)

      const validUser = await User.create({username: req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 1000).toString() , email: req.body.email , password: hashedPassword , profilePicture: req.body.photo});

      const token = jwt.sign({id: validUser._id} , process.env.JWT_SECRET)

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      return res.status(201).cookie('access_token' , token , {httpOnly: true , expires: expiryDate} ).json({ success: true, message: "User Logged In Successfully", validUser , token });
    }

    
  } catch (error) {
    next(error)
  }
}