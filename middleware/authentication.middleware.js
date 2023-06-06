const jwt=require("jsonwebtoken")
const{userModel}=require("../models/user.model")

require("dotenv").config()

const authenticate=(req,res,next)=>{
    // const token=req.headers.authentication?.split(" ")[1]
    const token=req.headers.authorization
    if(!token){
        return res.status(401).send("Please login first")
    }
    jwt.verify(token,process.env.key,(err,user)=>{
        if(err){
            return res.status(403).send("plz login")          
        }
        else{
            req.user=user
            next()
        }
    })
}

module.exports={authenticate}