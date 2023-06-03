const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const projectRouter = require('./routers/projectRouter')
const path = require('path');

const cors = require('cors')
const authMid = require('./middleware/authMiddleware')



const PORT = process.env.PORT || 8080
const app = express()

const errorHandler = async (err, req, res, next) => {
  if(err) console.log(err);
  next();
};

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());

app.use(cors({origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api', authRouter,errorHandler);

app.use(authMid);

app.use('/api', userRouter, errorHandler);
app.use('/api', projectRouter, errorHandler);

app.get('/svgs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '/public/svgs', filename);
  res.sendFile(filepath);
});

app.get('/backgrounds/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '/public/backgrounds', filename);
  res.sendFile(filepath);
});

app.get('/images/:login/:project/:filename', (req, res) => {
  const username = req.params.login;
  const filename = username + '_' + req.params.filename;
  const project = req.params.project;
  const filepath = path.join(__dirname, `/public/${username}/${project}`, filename);
  console.log(filepath)
  res.sendFile(filepath);
});

// app.get('/event_pics/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filepath = path.join(__dirname, '/public/event_pics', filename);
//   res.sendFile(filepath);
// });

// app.get('/profile_pics/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filepath = path.join(__dirname, '/public/profile_pics', filename);
//   res.sendFile(filepath);
// });

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))

