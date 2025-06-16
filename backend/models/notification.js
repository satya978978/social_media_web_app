const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/social_world`)
const user =require("./db")
const posts= require('./posts')

const notification = mongoose.Schema({
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    to_user:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Comment:{
        type:Boolean,
        default:false
    },
    postid:{
 type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    },
   like:{
        type:Boolean,
        default:false
    },
    date:{
      type:Date,
      default:Date.now  
    }
},{timestamps:true})
module.exports=mongoose.model("ntf",notification)