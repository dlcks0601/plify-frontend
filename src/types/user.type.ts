export type AuthProvider = 'spotify' | 'plify';

export interface User {
  authProvider: AuthProvider;
  email: string;
  name: string;
  nickname: string;
  profileUrl: string;
  userId: number;
}
