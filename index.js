require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');

const { default: axios } = require('axios');
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
  }),
);
app.use('/api', router);
app.use(ErrorMiddleware);

const start = async () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// keep onrender active
setInterval(async () => {
  try {
    const result = await axios.get('https://tododone5.onrender.com/api/shop/ping');
    console.log('tododone5: ' + (await result.data));
  } catch (error) {
    /* empty */
    console.log(error.response?.data.message);
  }
}, 100000);

start();
