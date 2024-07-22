import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'


dotenv.config({path: './config/config.env'})

const app = express()

connectDB();

app.use(express.json())
app.use(cors({
    methods: ["POST" , "GET" , "PUT" , "DELETE"],
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.use(cookieParser())



//ROutes
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'

app.use('/api/v1/user' , userRouter)

app.use('/api/v1/auth' , authRouter)





app.listen(process.env.PORT , (req,res) => {
    console.log(`Server is Running on PORT:${process.env.PORT}`)
})


app.use((err , req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({success: true , message , statusCode})
})