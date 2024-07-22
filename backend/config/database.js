import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "Auth_App"
    }).then((e) => {
        console.log(`Database is Connected ${e.connection.host}`)
    })
}

export default connectDB;