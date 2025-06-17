const mongoose = require('mongoose');


const posts=mongoose.Schema({
  userid:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"user"
  },
  posts: [
    {
      data: { type: Buffer },
      content_type: { type: String }
    }
  ]
  ,

    caption:String,
    Date:{
        type:Date,
        default:Date.now
    },
    
    comments:[

{
  username:String,
  text:String,
  date:{type:Date,default:Date.now
  },
  dp:String
 
 
} ],
    likes:[
     {  type: mongoose.Schema.Types.ObjectId,
   ref:"user"}
    
    ]
},{ timestamps: true }) 
module.exports= mongoose.model('posts',posts)