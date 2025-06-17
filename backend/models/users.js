

const mongoose = require('mongoose');

const users=mongoose.Schema({
    profile:{
       data:Buffer,
       content_type: String,
    },
    bio:{
        type:String,
        default:""
    },
    username: String,
   name:String,
    email: String,
    password: String,

    
    posts:[{
            
 type:mongoose.Schema.Types.ObjectId,
 ref:"posts"
    }],
    saved:[{
         type:mongoose.Schema.Types.ObjectId,
 ref:"posts"

    }]

    
}) 
module.exports= mongoose.model('user',users)