import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, CONFLICT } from 'http-status-codes';
import { User, NewUser } from '../types';
import userService from '../services/userService';

const router = Router();

router.post('/add', (req: Request, res: Response) => {
  const user = req.body;
  console.log(user);
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: 'Missing User',
    });
  }
  const newUser = userService.addUser(user);
  console.log(newUser);
  if (newUser) {
    return res.status(CREATED).json(newUser);
  }
  return res.status(CONFLICT).json({
    error: 'Username taken',
  });
});

export default router;
