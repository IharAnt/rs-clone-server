require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/ErrorMiddleware');

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
app.use(errorMiddleware);

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

start();
