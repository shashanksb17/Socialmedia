const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")

require("dotenv").config()

const {UserModel}=require("../models/user.model")
const {authenticate}=require("../middleware/authentication.middleware")



const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,dob,bio,posts,friends,friendRequests}=req.body
    try{
        let user=await UserModel.findOne({email})
        if(user){
            res.status(409).send("email id already registered")
        }
        else{
            const hashed_password=bcrypt.hashSync(password,6)
            const user=new UserModel({name,email,password:hashed_password,dob,bio,posts,friends,friendRequests})
            await user.save()
            return res.status(201).send({message:"User registered successfully"})

        }
    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        let user=await UserModel.findOne({email})
        if(user){
            let hashed_password=user.password
            bcrypt.compare(password,hashed_password,async(err,result)=>{
                if(err){
                    return res.status(401).send({message:"Wrong Credientials"})
                }
                else if(result){
                    var token=jwt.sign({id:user._id,name:user.name},process.env.key)
                    res.status(201).send({message:"Login Successfull",token,user})
                }else{
                    return res.status(401).send({message:"Wrong Credientials"})
                }
            })
        }
    }
    catch(err){
        return res.status(404).send({message:err.message})
    }
})

userRouter.get("/users",authenticate,async(req,res)=>{
    try{
        const users = await UserModel.find()
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({message:"server error"})
    }
})

userRouter.get("/users/:id/friends",authenticate,async(req,res)=>{  
    const id=req.params.id
    try{
        const user=await UserModel.findById(id)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const friends=await UserModel.find({_id:{$in:user.friends}})
        res.status(200).json(friends)
    }
    catch(err){
        res.status(500).json({message:"server error"})
    }
})

userRouter.post("/users/:id/friends",async(req,res)=>{
    const id=req.params.id
    const friendId=req.body.friendId

    try{
        const user=await UserModel.findById(id)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        user.friendRequests.push(friendId)

        await user.save()

        res.status(200).json({message:"friend request sent"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"server error"})
    }
})

userRouter.put("/users/:id/friends/:friendId",async(req,res)=>{
    try {
        const userId=req.params.id;
        const friendId=req.params.friendId;
        const {status}=req.body;

        const user=await UserModel.findById(userId);
        if(!user){
            return res.send({message:"user not found"})
        }
        if(status==="accepted"){
            user.friends.push(friendId)
        }
        user.friendRequests=user.friendRequests.filter((id)=>id.toString()!==friendId);
        await user.save()
        res.status(204).json({message:"friend request updated"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"server error"})
    }
})





module.exports={userRouter}