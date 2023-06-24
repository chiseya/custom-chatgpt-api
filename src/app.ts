import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler, notFound } from '@/middlewares';
import routes from '@/routes';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
