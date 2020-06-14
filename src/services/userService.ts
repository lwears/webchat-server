import { User } from '../types';

const users: Array<User> = [];

const validateUsername = (username: string): void => {
  const exists = users.some((el) => {
    return el.username.toLowerCase() === username.toLowerCase();
  });
  if (exists) throw new Error('Username Taken');
  if (!/^\w{4,12}$/.test(username)) {
    throw new Error(
      'Username must be between 4-12 letters and contain no special characters'
    );
  }
};

const addUser = (username: string, id: string): User => {
  validateUsername(username);
  const newUser = { loggedIn: true, username, id };
  users.push(newUser);
  return newUser;
};

const removeUser = (id: string): User => {
  const index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
};

const getUser = (id: string): User | undefined => {
  if (users.length) return users.find((user) => user.id === id);
  return undefined;
};

const getAllUsers = (): User[] => users;

export default {
  addUser,
  validateUsername,
  removeUser,
  getUser,
  getAllUsers,
};
