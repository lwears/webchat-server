export enum ChatEvent {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  NEW_USER = 'new_user',
  LOGOUT = 'logout',
}

export enum ChatEventClient {
  USER_CONNECTED = 'user_connected',
  USER_LOGOUT = 'user_logout',
  BROADCAST_MESSAGE = 'broadcast_message',
  USER_DISCONNECTED = 'user_disconnected',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  UPDATE_USERS = 'update_users',
}
