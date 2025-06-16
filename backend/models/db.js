const mongoose = require("mongoose")

mongoose.connect(`mongodb://127.0.0.1:27017/social_world`)


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