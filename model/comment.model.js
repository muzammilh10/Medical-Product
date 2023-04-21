const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment:{
        type: String,
        trim: true,
        required:[true,'comment can not be empty']
    },
    
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:['true','comment must have a user']
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref:'Product',
        required:['true','you can only comment on valid products']
    }

},{
    timestamps:true
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment