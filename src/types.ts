export interface ChatMessage {
  author: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
}

export type NewUser = Omit<User, 'id'>;
