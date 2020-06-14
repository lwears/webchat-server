export interface ChatMessage {
  author: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
  loggedIn: boolean;
}

export type ChatUser = Omit<User, 'loggedIn'>;
