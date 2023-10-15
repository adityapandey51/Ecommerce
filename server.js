import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import categoryRoutes from "./routes/category.js"
import productRoutes from './routes/productRoutes.js'


// Configuring dotenv
dotenv.config()

// rest objext
const app=express()

const PORT =process.env.PORT;

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// connection with mongoDB
connectDB()


// routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)


// rest api
app.get("/",((req,res)=>{
    res.send("<h1>Server has Started</h1>")
}))

// listening to the port
app.listen(PORT || 8080 ,(()=>{
    console.log(`Server started in ${process.env.DEV_MODE} on Port ${PORT}`)
}))

