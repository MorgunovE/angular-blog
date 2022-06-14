export interface User {
  email: string
  password: string
  returnSecureToken?: boolean
}
export interface FBAuthResponse {
  idToken: string
  expiresIn: string
}
