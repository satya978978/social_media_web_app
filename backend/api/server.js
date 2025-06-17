require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../app');

let isConnected = false;

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

  return app(req, res); // Express handles the request
};
