import { User } from '../types';

const users: Array<User> = [
  { name: 'Liam', id: 1 },
  { name: 'Billybob', id: 2 },
  { name: 'Daniel', id: 3 },
];

const userExists = (username: string): boolean => {
  return users.some((el) => {
    return el.name === username;
  });
};

const postUser = (user: User): User | boolean => {
  if (userExists(user.name)) {
    return false;
  }
  users.push({ id: users.length + 1, name: user.name });
  return true;
};

export default {
  postUser,
};
