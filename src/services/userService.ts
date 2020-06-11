import { User } from '../types';

const users: Array<User> = [
  { username: 'Liam', id: '1' },
  { username: 'Billybob', id: '2' },
  { username: 'Daniel', id: '3' },
];

const usernameExists = (username: string): void => {
  const exists = users.some((el) => {
    return el.username.toLowerCase() === username.toLowerCase();
  });
  if (exists) throw new Error('Username Taken');
};

const addUser = (username: string, id: string): User => {
  const newUser = { loggedIn: true, username, id };
  users.push(newUser);
  console.log(users);
  return newUser;
};

export default {
  addUser,
  usernameExists,
};
