 import mongoose from "mongoose";

 export const connectDB = async () =>{
    await mongoose.connect(process.env.DB_CONNECTION!)
    .then(()=> console.log("connect to DB"))
    .catch (() => console.log("samting went wrong with conect to DB"))
 }