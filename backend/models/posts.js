const mongoose = require("mongoose")
const users =require("./db")

mongoose.connect(`mongodb://127.0.0.1:27017/social_world`)


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