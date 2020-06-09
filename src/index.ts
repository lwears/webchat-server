import express, { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import cors from 'cors';
import path from 'path';
import logger from './logger';
import covid19Router from './routes/covid19Stats';
import indexRouter from './routes/index';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use('/', indexRouter);
app.use('/api/covidstats', covid19Router);

app.use((err: Error, _req: Request, res: Response) => {
  logger.error(err.message, err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const PORT = normalizePort(process.env.PORT || '3000');

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const gracefulShutdown = (): void => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
