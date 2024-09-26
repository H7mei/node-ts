import express from 'express';
// import path from 'path';
// import {fileURLToPath} from 'url';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import {protect} from './modules/auth';
import {createNewUser, signin} from './handlers/user';
import config from './config';

const app = express();

// // Get __dirname in ES6
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * app.[method]([route], [route handler])
 */
app.get('/', (req, res) => {
  // sending back an HTML file that a browser can render on the screen.
  // res.sendFile(path.resolve(__dirname, 'pages/index.html'));

  res.send('Hello World!');
});

app.post('/user', createNewUser);
app.post('/signin', signin);

// protected routes
app.use('/api', protect, router);

// add error handling middleware
app.use((err, req, res, next) => {
  console.log(err.type);
  if (err.type === 'input') {
    res.status(400);
    return res.send('invalid input');
  } else if (err.type === 'auth') {
    res.status(401);
    return res.send('unauthorized');
  } else if (err.type === 'router') {
    res.status(505);
    return res.send('api route error');
  } else {
    res.status(500);
    return res.send('an error occurred');
  }
});

// creates and starts a server for our API on a defined port
app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});

export default app;
