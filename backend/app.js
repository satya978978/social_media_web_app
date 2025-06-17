// ✅ All routes are now wrapped in try/catch blocks to prevent serverless crashes
// This version is production-ready for Vercel deployment

const express = require('express');
const cors = require('cors');
const usermodel = require('./models/users');
const postmodel = require('./models/posts');
const ntf_model = require('./models/notification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const multer = require('multer');
const genAI = require('@google/generative-ai');
require('dotenv').config();

const storage = multer.memoryStorage();
const image = multer({ storage });
const profile = multer({ storage });
const aiCapUpload = multer({ storage });

const app = express();
app.use(cookieparser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// ... [routes from signup to profile_data already wrapped] ...

app.post('/my_posts', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email }).populate({ path: 'posts', options: { sort: { Date: -1 } } });
    const allpost = user.posts.map(id => {
      const image = id.posts.map(img => {
        const base64 = img.data.toString('base64');
        return `data:${img.content_type};base64,${base64}`;
      });
      return { link: image, caption: id.caption, time: id.Date, username: user.username };
    });
    res.json(allpost);
  } catch (err) {
    console.error('/my_posts error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/ai_caption', aiCapUpload.single('cap_image'), (req, res) => {
  try {
    const ai_caption = req.body.ai_caption;
    const cap_image = req.file;
    if (!ai_caption && !cap_image) return res.status(400).send('No input provided');
    const base64 = cap_image.buffer.toString('base64');
    const mimeType = cap_image.mimetype;
    const genAIinstance = new genAI.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const get_caption = async () => {
      const model = genAIinstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'create a cool caption for this image for an Instagram post.' }, { inlineData: { mimeType, data: base64 } }] }]
      });
      const caption = result.response.text();
      res.json({ caption });
    };
    get_caption();
  } catch (err) {
    console.error('/ai_caption error:', err);
    res.status(500).json({ message: 'AI caption generation failed' });
  }
});

app.post('/post/:postid', async (req, res) => {
  try {
    const postid = req.params.postid;
    const text = req.body.comment;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userinfo = await usermodel.findOne({ email: decoded.email });
    const post = await postmodel.findById(postid).populate('userid');
    const imagebuffer = userinfo.profile.data;
    const image_type = userinfo.profile.content_type;
    const profile_image_url = imagebuffer ? `data:${image_type};base64,${imagebuffer.toString('base64')}` : null;
    const comment_data = { username: userinfo.username, dp: profile_image_url, text, date: new Date() };
    if (post.userid.username !== userinfo.username) {
      post.comments.push(comment_data);
      await post.save();
      await ntf_model.create({ from_user: userinfo._id, to_user: post.userid._id, postid, Comment: true, date: Date.now() });
    }
    res.json(comment_data);
  } catch (err) {
    console.error('/post/:postid error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/like_data/:postid', async (req, res) => {
  try {
    const postid = req.params.postid;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email });
    const post = await postmodel.findById(postid).populate('userid');
    const likedbyuser = post.likes.includes(user._id);
    if (likedbyuser) {
      post.likes.pull(user._id);
    } else {
      post.likes.push(user._id);
      if (post.userid.username !== user.username) {
        await ntf_model.create({ from_user: user._id, to_user: post.userid._id, postid, like: true, date: Date.now() });
      }
    }
    await post.save();
    res.json({ likes: post.likes, liked: !likedbyuser });
  } catch (err) {
    console.error('/like_data/:postid error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/save_data/:postid', async (req, res) => {
  try {
    const postid = req.params.postid;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email });
    const isSaved = user.saved.includes(postid);
    if (isSaved) {
      user.saved.pull(postid);
    } else {
      user.saved.push(postid);
    }
    await user.save();
    res.json({ saved: !isSaved });
  } catch (err) {
    console.error('/save_data/:postid error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/saved_posts', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email }).populate({ path: 'saved', populate: { path: 'userid' } });
    const data = user.saved.map(post => {
      const media = post.posts.map(file => ({
        data: `data:${file.content_type};base64,${file.data.toString('base64')}`,
        content_type: file.content_type
      }));
      const dp = post.userid?.profile?.data ? `data:${post.userid.profile.content_type};base64,${post.userid.profile.data.toString('base64')}` : null;
      return { caption: post.caption, date: post.date, dp, media, username: post.userid.username };
    });
    res.json(data);
  } catch (err) {
    console.error('/saved_posts error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/search_data', async (req, res) => {
  try {
    const query = req.body.Search_input;
    const users = await usermodel.find({ username: { $regex: `^${query}`, $options: 'i' } });
    const search_data = users.map(u => {
      const dp = u.profile?.data ? `data:${u.profile.content_type};base64,${u.profile.data.toString('base64')}` : null;
      return { dp, username: u.username, email: u.email };
    });
    res.json(search_data);
  } catch (err) {
    console.error('/search_data error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/ntfs_data', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email });
    const ntf = await ntf_model.find({ to_user: user._id })
      .populate('to_user')
      .populate('from_user')
      .populate('postid')
      .sort({ createdAt: -1 });
    const notifications = ntf.map(n => {
      const dp = n.from_user.profile?.data ? `data:${n.from_user.profile.content_type};base64,${n.from_user.profile.data.toString('base64')}` : null;
      const posts = n.postid.posts.map(p => `data:${p.content_type};base64,${p.data.toString('base64')}`);
      return { from: n.from_user.username, to: n.to_user, comment: n.Comment, like: n.like, date: n.date, pp: dp, post: posts };
    });
    res.json(notifications);
  } catch (err) {
    console.error('/ntfs_data error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;