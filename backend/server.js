require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
console.log('🟡 Starting server file...');

const app = require('./app')


const PORT = process.env.PORT || 5000;
console.log('🌐 Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
