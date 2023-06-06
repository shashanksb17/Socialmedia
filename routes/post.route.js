const express=require("express")
// const bcrypt=require("bcrypt")
// const jwt=require("jsonwebtoken")
// const mongoose=require("mongoose")

require("dotenv").config()

const {UserModel}=require("../models/user.model")
const {PostModel}=require("../models/post.model")
const {authenticate}=require("../middleware/authentication.middleware")

const postRouter=express.Router()

postRouter.post("/posts",authenticate,async(req,res)=>{
    try {
        const userId=req.user.userId;
        const {text,image}=req.body;
        const post=await PostModel.create({
            user:userId,
            text,
            image,
            createdAt:new Date(),
            likes:[],
            comments:[]
        })
        const user=await UserModel.findById(userId);
        user.posts.push(post._id);
        await user.save();
        res.status(201).json({post})
    } 
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

postRouter.post("/posts/:id",authenticate,async(req,res)=>{
    try{
       const postId=req.params.id
       const {text,image}=req.body
       const UserId=req.user.id

       const post=await PostModel.findbyId(postId)
       if(!post){
        return res.status(403).json({message:"post not found"})
       }
       if(post.user.toString()!==userId){
        return res.status(403).json({messsage:"no match"})
       }
       post.text=text
       post.image=image
       await post.save()
       res.status(201).json({message:"posted succesfully"})

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

postRouter.delete("/posts/:id",authenticate,async(req,res)=>{
    try{
       const postId=req.params.id
       const UserId=req.user.id

       const post=await PostModel.findbyId(postId)
       if(!post){
        return res.status(403).json({message:"post not found"})
       }
       if(post.user.toString()!==userId){
        return res.status(403).json({messsage:"no match"})
       }
 
       await post.delete()
       res.status(201).json({message:"post deleted succesfully"})

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

postRouter.post("/posts/:id/like",authenticate,async(req,res)=>{
    try{
       const postId=req.params.id
       const UserId=req.user.id

       const post=await PostModel.findbyId(postId)
       if(!post){
        return res.status(404).json({message:"post not found"})
       }
       if(post.likes.includes(userId)){
        return res.status(409).json({messsage:"post already liked"})
       }
       post.likes.push(userId)
       await post.save()
       res.status(201).json({message:"posted liked succesfully"})

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

postRouter.post("/posts/:id/comment",authenticate,async(req,res)=>{
    try{
       const postId=req.params.id
       const {text}=req.body
       const UserId=req.user.id

       const post=await PostModel.findbyId(postId)
       if(!post){
        return res.status(404).json({message:"post not found"})
       }
       const user=await UserModel.findbyId(UserId)
       if(!user){
        return res.status(404).json({message:"user not found"})
       }
       const comment={user:userId,text}
       post.comments.push(comment)
       await post.save()
       res.status(201).json({message:"comment liked succesfully"})

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})

postRouter.get("/posts/:id",authenticate,async(req,res)=>{
    try{
       const postId=req.params.id


       const post=await PostModel.findbyId(postId)
       if(!post){
        return res.status(404).json({message:"post not found"})
       }

     
       res.status(201).json(post)

    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})




module.exports={postRouter}