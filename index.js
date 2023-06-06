const express=require("express")
const cors = require("cors");
const {connection}=require("./config/db")
const {userRouter}=require("./routes/user.route")
const {postRouter}=require("./routes/post.route")


require("dotenv").config()

const app=express()
app.use(express.json())
app.use(cors());
app.use("",userRouter)
app.use("",postRouter)

app.use("/",(req,res)=>{
    res.send("HOME PAGE OF SOCIAL MEDIA APP")
})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to DB")
    }
    catch(err){
        console.log("can not connect DB")
        console.log(err)
    }
    console.log(`server is running at port ${process.env.port}`)
})