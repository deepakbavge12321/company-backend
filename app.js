const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/companyRoute');

const app = express();

app.use(express.json());

// database connection
const dbURI = 'mongodb+srv://deepakbavge12321:8whUG5kUW@cluster0.my0ji2h.mongodb.net/node-jwt?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.use(authRoutes);
