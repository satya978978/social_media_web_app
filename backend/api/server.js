require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = require('../app');
const cors =require('cors')
app.use(cors())

let isConnected = false;

const handler = serverless(app); // Wrap express app

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  return handler(req, res); // Now properly wrapped for serverless
};
