export enum ChatEvent {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  NEW_USER = 'new_user',
}

export enum ChatEventClient {
  USER_CONNECTED = 'user_connected',
  BROADCAST_MESSAGE = 'broadcast_message',
  USER_DISCONNECTED = 'user_disconnected',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
}
