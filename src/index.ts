import express from "express"
import mongoose from "mongoose"
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/producteRoute.js"
import { seedIntialProducts } from "./services/productService.js";

const app = express()
const port = 3001;
app.use(express.json())

mongoose
    .connect("mongodb://localhost:27017/ecommerce")
    .then(()=> console.log("mongo connected"))
    .catch((err)=> console.log("faild to connect",err))

//seed products in database
seedIntialProducts();

app.use('/user',userRoute)
app.use('/product',productRoute)


app.listen(port,()=>{
    console.log(`server is running at : http://localhost:${port}`)
})
