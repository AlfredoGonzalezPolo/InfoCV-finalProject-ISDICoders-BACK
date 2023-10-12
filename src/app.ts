import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { userRouter } from './routers/user.router.js';
import { errorHandler } from './middlewares/error.js';
import { curriculumRouter } from './routers/curriculum.router.js';

const debug = createDebug('INFOCV:APP');
debug('Loaded InfoCV APP');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_request, response) => {
  response.send('Initiating amazing things');
});

app.use('/user', userRouter);
app.use('/curriculum', curriculumRouter);

app.use((_request, _response, next) => {
  next();
});

app.use(errorHandler);
