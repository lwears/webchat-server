import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import cors from 'cors';
import path from 'path';
import socketio from 'socket.io';
import http from 'http';
import logger from './logger';
import { ChatEvent, ChatEventClient } from './constants';
import { User } from './types';
// import indexRouter from './routes/index';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users: Array<User> = [
  { name: 'Liam', id: 1 },
  { name: 'Billybob', id: 2 },
  { name: 'Daniel', id: 3 },
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/', (_req, res) => {
  res.send('Server is up and running');
});

io.on(ChatEvent.CONNECT, (socket) => {
  logger.info(`user ${socket.id} connected`);
  socket.on(ChatEvent.NEW_USER, (name) => {
    socket.broadcast.emit(ChatEventClient.USER_CONNECTED, name);
  });
  socket.on(ChatEvent.MESSAGE, (message: string) => {
    socket.broadcast.emit(ChatEventClient.BROADCAST_MESSAGE, {
      message,
      name: users[socket.id],
    });
    console.log(message);
  });
  socket.on(ChatEvent.DISCONNECT, () => {
    socket.broadcast.emit(ChatEventClient.USER_DISCONNECTED, 'User-Left');
    logger.info('Client disconnected');
  });
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
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

server.listen(PORT, () => {
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
