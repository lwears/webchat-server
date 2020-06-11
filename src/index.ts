import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import cors from 'cors';
import path from 'path';
import socketio from 'socket.io';
import http from 'http';
import logger from './logger';
import { ChatEvent, ChatEventClient } from './constants';
import userService from './services/userService';
import userRouter from './routes/users';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use('/users', userRouter);

app.get('/', (_req, res) => {
  res.send('Server on');
});

io.on(ChatEvent.CONNECT, (socket) => {
  logger.info(`user ${socket.id} connected`);
  socket.on(ChatEvent.NEW_USER, (username: string) => {
    try {
      userService.usernameExists(username);
      const user = userService.addUser(username, socket.id);
      socket.emit(ChatEventClient.LOGIN_SUCCESS, user);
      socket.broadcast.emit(ChatEventClient.USER_CONNECTED, username);
      logger.info(`${username} - ${socket.id} - Access Granted`);
    } catch (error) {
      socket.emit(ChatEventClient.LOGIN_FAILURE, error.message);
      logger.info(`${username} - ${socket.id} - ${error.message}`);
    }
  });

  socket.on(ChatEvent.MESSAGE, (message: string) => {
    socket.emit('test', 'test');
    socket.broadcast.emit(ChatEventClient.BROADCAST_MESSAGE, message);
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
