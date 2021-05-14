/* eslint-disable no-shadow */
export enum EAuthState {
  LOGGED = 'LOGGED',
  LOGIN_ERROR = 'LOGIN_ERROR',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
  LOGOUT = 'LOGOUT'
}

export enum EAuthAction {
  AUTH_LOGIN = 'AUTH:LOGIN',
  AUTH_LOGOUT = 'AUTH:LOGOUT',
  AUTH_LOGIN_ERROR = 'AUTH:LOGOUT',
  USER_GET_DATA = 'USER:GET_DATA'
}
