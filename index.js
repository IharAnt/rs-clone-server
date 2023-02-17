require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/ErrorMiddleware')
const cookieSession = require("cookie-session");

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const app = express();
// app.use(
//   cookieSession({
//     name: "__session",
//     keys: ["key1"],
//       maxAge: 20 * 24 * 60 * 60 * 1000,
//       secure: true,
//       httpOnly: true,
//       sameSite: 'none'
//   })
// );
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());
app.set('trust proxy', 1)

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();