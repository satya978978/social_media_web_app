const express = require('express')
const { sign } = require('jsonwebtoken')
const cors = require('cors')
const usermodel = require('./models/users')
const postmodel = require('./models/posts')
const ntf_model=require('./models/notification')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieparser = require("cookie-parser")
const multer = require('multer')
const genAI = require('@google/generative-ai');
const path = require('path')
const mimi = require('mime-types')
const fs = require('fs')
const { json } = require('stream/consumers')

const storage = multer.memoryStorage()
const image = multer({ storage: storage })
const profile = multer({ storage: storage })
const aiCapUpload = multer({ storage: multer.memoryStorage() });
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;






const app = express()
app.use(cookieparser())
app.use(cors({
  origin: ['http://localhost:5173', 'https://saatya-world.onrender.com'],
  credentials: true
}));
app.use(express.json())


// Basic home route (optional)
app.get("/", (req, res) => {
  res.send("API is working");
});

// Prevent favicon.ico crash
app.get("/favicon.ico", (req, res) => res.status(204).end());



app.post("/signup", async (req, res) => {


  const { username, email, password } = req.body
  const existed_mail = await usermodel.findOne({ email })
  if (existed_mail) {

    return res.json({
      message: "notok"
    })

  }
  bcrypt.hash(password, 10, async function (err, hash) {
    await usermodel.create({
      username,
      email,
      password: hash,
      profile: {
        data: undefined,
        content_type: ""
      }

    });
    const token = jwt.sign({ email: email },JWT_SECRET )
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax"
    })


    res.json({
      message: "newuserok"
    })

  })




})
app.post("/login", async (req, res) => {
  console.log("hitted")
  const {email, password } = req.body
  const user = await usermodel.findOne({ email: email })
  console.log("done ree")
  if (!user) {
    return res.send("wrong some")

  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (result == true) {
console.log("JWT_SECRET IN USE:", JWT_SECRET)

      const token = jwt.sign({ email: email }, JWT_SECRET)
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
      })
      res.json({
        message: "ok"
      }
      )

    } else {
      res.json({
        message: "notok"
      })
    }

  })

})
app.post("/creat_post", image.array('image'), async (req, res) => {

  const token = req.cookies.token

  const cokie = jwt.verify(token,JWT_SECRET)
  console.log(cokie.email)


  const userinfo = await usermodel.findOne({ email: cokie.email })




  const caption = req.body.caption
  const image_data = req.files.map((f) => {
    return {
      data: f.buffer,
      content_type: f.mimetype
    }

  })
  const newpost = await postmodel.create({
    userid: userinfo._id,
    posts: image_data,
    caption: caption

  })
  console.log("swati")
  await usermodel.findOneAndUpdate({ email: cokie.email },
    { $push: { posts: newpost._id } })
  res.json({ message: "post pushed into user document (thoko talii)" })

})


app.post("/post_data", async (req, res) => {


  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const currentUser = await usermodel.findOne({ email: decoded.email });

  const postss = await postmodel.find().populate("userid").sort({ createdAt: -1 })
  const update_image = postss.map((post) => {

    let imgurl = null
    if (post.userid && post.userid.profile && post.userid.profile.data) {
      const base64 = post.userid.profile.data.toString('base64');
      imgurl = `data:${post.userid.profile.content_type};base64,${base64}`;
    }
    const media = post.posts.map(image => {
      const base64 = image.data.toString("base64")






      return {
        data: `data:${image.content_type};base64,${base64}`,
        content_type: image.content_type
      }
    })
    const likedByUser = post.likes.map(id => id.toString()).includes(currentUser._id.toString());
    const savedbyuser = currentUser.saved.map(id => id.toString()).includes(post._id.toString())
    return {
      _id: post._id,
      userid: post.userid ? post.userid.username : "Unknown",
      caption: post.caption,
      images: media,
      date: post.Date,
      dp: imgurl,
      comments: post.comments,
      likes: post.likes,
      likedByUser: likedByUser,
      savedbyuser: savedbyuser


    }
  })
  res.json(update_image)
})

app.post("/profile_data", profile.single("pp"), async (req, res) => {
  const bio = req.body.bio;
  const username = req.body.username;
  const token = req.cookies.token

  const decoded = jwt.verify(token, JWT_SECRET)
  const profile_id = await usermodel.findOneAndUpdate({ email: decoded.email }, {
    username,
    bio,
    ...(req.file && {
      profile: {
        data: req.file.buffer,
        content_type: req.file.mimetype
      }
    })


  }
    , {
      new: true
    })
  const sending_data = await usermodel.findOne({ email: decoded.email })
  let imgurl = null
  if (profile_id.profile && profile_id.profile.data) {
    const base64 = profile_id.profile.data.toString('base64')
    imgurl = `data:${profile_id.profile.content_type};base64,${base64}`;

  }

  res.json({
    bio: sending_data.bio,
    username: sending_data.username,
    imgurl: imgurl


  })

})
app.post("/my_posts", async (req, res) => {

  const token = req.cookies.token
  const cokie = jwt.verify(token,JWT_SECRET )

  const user = await usermodel.findOne({ email: cokie.email }).populate({
    path: 'posts',
    options: { sort: { Date: -1 } }
  })

  const allpost = user.posts.map((id) => {
    const image = id.posts.map((img) => {
      const data = img.data
      const content_type = img.content_type
      const base64 = data.toString('base64')
      return `data:${content_type};base64,${base64}`;


    })
    return {
      link: image,
      caption: id.caption,
      time: id.Date,
      username: user.username
    }
  })

  res.json(allpost)
})
app.post("/ai_caption", aiCapUpload.single('cap_image'), (req, res) => {
  const ai_caption = req.body.ai_caption
  console.log(ai_caption)
  const cap_image = req.file
  if (!ai_caption && !cap_image) {
    console.log("no credentials")
    return console.log("no image")

  } else {
    const base64 = cap_image.buffer.toString('base64')
    const mimeType = cap_image.mimetype
    const genAIinstance = new genAI.GoogleGenerativeAI('AIzaSyAlrYM9T7EpZhsmO1lodikhVuTaF3TLisI')
    const get_caption = async (cap_image) => {
      const model = genAIinstance.getGenerativeModel({ model: "gemini-1.5-flash" })

      const result = await model.generateContent(
        {
          contents: [
            {
              role: "user",
              parts: [
                { text: "create a cool caption for this image for a instagram post give only straight forward one caption of one to two line only always only the main line u have to give caption because i am using  ur api in my app so dont mess" },
                {
                  inlineData: {
                    mimeType,
                    data: base64
                  }
                }

              ]
            }

          ]
        }

      )
      const caption = result.response.text()
      console.log(caption)
      res.json({ caption: caption })
    }
    get_caption();
  }


})

app.post("/post/:postid", async (req, res) => {

  const postid = req.params.postid;
  const text = req.body.comment
  const token = req.cookies.token

  const cokie = jwt.verify(token, JWT_SECRET )
  const userinfo = await usermodel.findOne({ email: cokie.email })
  const post= await postmodel.findById(postid).populate('userid')

  const imagebuffer = userinfo.profile.data
  const image_type = userinfo.profile.content_type

const profile_image_url = imagebuffer ? `data:${image_type};base64,${imagebuffer.toString("base64")}` : null;
  const comment_data = {
    username: userinfo.username,
    dp: profile_image_url,
    text: text,
    date: new Date()

  }
if (post.userid.username !== userinfo.username)
 {
      const post = await postmodel.findById(postid).populate('userid')
  post.comments.push(comment_data)
  await post.save()
  await ntf_model.create({
      from_user:userinfo._id,
      to_user:post.userid._id,
      postid:postid,
      Comment:true,
      date:Date.now()
    })
  }

  console.log("okiehaibhai")
  res.json(comment_data)
}
)
app.post("/like_data/:postid", async (req, res) => {
  console.log("hitting")
  const postid = req.params.postid
  const token = req.cookies.token

  const cokkie = jwt.verify(token,JWT_SECRET )
  const user = await usermodel.findOne({ email: cokkie.email })
  const post = await postmodel.findById(postid).populate('userid')

  const likedbyuser = post.likes.includes(user._id)
  if (likedbyuser) {
    post.likes.pull(user._id)
    await post.save()
    res.json({ likes: post.likes, liked: false })

  } else {
    post.likes.push(user._id)
    await post.save()


if (post.userid.username!==user.username) {
  
    await ntf_model.create({
      from_user:user._id,
      to_user:post.userid._id,
            postid:postid,

      like:true,
      date:Date.now()
    })
}
    console.log("liking satya")
    res.json({ likes: post.likes, liked: true })
    
  }


})

app.post("/save_data/:postid", async (req, res) => {
  const postid = req.params.postid
  const token = req.cookies.token

  const cookie = jwt.verify(token,JWT_SECRET )
  const user = await usermodel.findOne({ email: cookie.email })

  if (user.saved.includes(postid)) {
    user.saved.pull(postid)
    await user.save()
    res.json({ saved: false })


  } else {
    user.saved.push(postid)
    await user.save()
    console.log("first")
    res.json({ saved: true })

  }


})

app.post("/saved_posts", async (req, res) => {
  const token = req.cookies.token
  const cokkie = jwt.verify(token,JWT_SECRET )
  const user = await usermodel.findOne({ email: cokkie.email }).populate({
    path: "saved",
    populate: {
      path: "userid"
    }
  })
  const data = user.saved.map(post => {
    const media = post.posts.map(file => (
      {
        data: `data:${file.content_type};base64,${file.data.toString("base64")}`,
        content_type: file.content_type
      }))

    const dp = post.userid?.profile?.data
      ? `data:${post.userid.profile.content_type};base64,${post.userid.profile.data.toString('base64')}`
      : null;

    return {
      caption: post.caption,
      date: post.date,
      dp: dp,
      media: media,
      username: post.userid.username,

    }
  })
  res.json(data)
  console.log("iamok")

})
app.post("/search_data", async (req, res) => {
  const query = req.body.Search_input
  console.log(query)
  const user = await usermodel.find({ username: { $regex: "^" + query, $options: "i" } })
  const search_data = user.map(u => {
    let dp = null
    if (u.profile && u.profile.data) {
      dp = `data:${u.profile.content_type};base64,${u.profile.data.toString('base64')}`
    }
    return {
      dp: dp,
      username: u.username,
      email: u.email
    }
  })
  res.json(search_data)
  console.log("agya re")
})
app.post("/ntfs_data",async (req,res)=>{
  const token = req.cookies.token
  const cookie= jwt.verify(token,JWT_SECRET )
 const user=await usermodel.findOne({email:cookie.email})
 const ntf = await ntf_model.find({ to_user: user._id })
  .populate('to_user')
  .populate('from_user')
  .populate('postid')
  .sort({ createdAt: -1 });
 

const notifications = ntf.map(ntf => {
  const dp = ntf.from_user.profile?.data
    ? `data:${ntf.from_user.profile.content_type};base64,${ntf.from_user.profile.data.toString('base64')}`
    : null;
const posts = ntf.postid.posts.map(p =>
  `data:${p.content_type};base64,${p.data.toString('base64')}`
);

   
    
    

  return {
    from: ntf.from_user.username,
    to: ntf.to_user,
    comment: ntf.Comment,
    like: ntf.like,
    date: ntf.date,
    pp: dp,
    post:posts
  };
});

res.json(notifications)

})
module.exports = app;
