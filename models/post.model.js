const mongoose=require("mongoose")
var ObjectId = require('mongodb').ObjectId;

const PostSchema= new mongoose.Schema({
    name: {type:String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: {type:String},
    image: {type:String},
    createdAt: {type:Date, default:Date.now},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: {type:String},
        createdAt: {type:Date, default:Date.now}
    }]
},{
    versionKey:false
})


const PostModel=new mongoose.model("Post",PostSchema)
module.exports={PostModel}