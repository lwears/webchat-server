import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import cors from 'cors';
import socketio from 'socket.io';
import http from 'http';
import logger from './logger';
import { ChatEvent, ChatEventClient } from './constants';
import userService from './services/userService';
import { User } from './types';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
  res.send('Server online');
});

io.on(ChatEvent.CONNECT, (socket) => {
  logger.info(`Connection opened from ${socket.id}`);
  let inactivityTimer: NodeJS.Timeout;

  const disconnectUser = (inactivity: boolean) => {
    const user = userService.getUser(socket.id);
    let loggerMessage = `${socket.id} disconnected`;
    const systemMessage = {
      author: 'System',
      message: ``,
    };
    if (user) {
      socket.leave('chat');
      userService.removeUser(socket.id);
      systemMessage.message = `${user.username} exited chat`;
      loggerMessage = `${user.username} exited chat`;
      if (inactivity) {
        socket.emit('logout');
        socket.emit(
          ChatEventClient.LOGIN_FAILURE,
          'Disconnected due to inactivity'
        );
        systemMessage.message = `${user.username} Disconnected due to inactivity`;
        loggerMessage = `User ${socket.id} Disconnected due to inactivity`;
      }
      io.to('chat').emit(ChatEventClient.USER_LOGOUT, systemMessage);
      const users = userService.getAllUsers();
      io.to('chat').emit(ChatEventClient.UPDATE_USERS, users);
    }
    logger.info(`${loggerMessage}`);
  };

  const startInactvityTimer = (time = 900000): void => {
    inactivityTimer = setTimeout(() => {
      disconnectUser(true);
    }, time);
  };

  socket.on(ChatEvent.NEW_USER, (username: string) => {
    try {
      const user = userService.addUser(username, socket.id);
      socket.emit(ChatEventClient.LOGIN_SUCCESS, user);
      logger.info(`${username} - ${socket.id} - Access Granted`);
      socket.join('chat');
      const systemMessage = {
        author: 'System',
        message: `${username} joined the chat`,
      };
      socket.to('chat').emit(ChatEventClient.USER_CONNECTED, systemMessage);
      startInactvityTimer();
      const users = userService.getAllUsers();
      io.to('chat').emit(ChatEventClient.UPDATE_USERS, users);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit(ChatEventClient.LOGIN_FAILURE, error.message);
        logger.info(`${username} - ${socket.id} - ${error.message}`);
      }
    }
  });

  socket.on(ChatEvent.MESSAGE, (message: string) => {
    clearTimeout(inactivityTimer);
    startInactvityTimer();
    socket.to('chat').emit(ChatEventClient.BROADCAST_MESSAGE, message);
  });

  socket.on(ChatEvent.LOGOUT, () => {
    disconnectUser(false);
  });

  socket.on(ChatEvent.DISCONNECT, () => {
    disconnectUser(false);
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
  logger.info(`Termination signal received, system shutdown initiated`);
  io.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
