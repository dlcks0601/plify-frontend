import { User } from './user.type';

export interface AuthResponse {
  message: {
    code: number;
    text: string;
  };
  accessToken: string;
  user: User;
  isExistingUser: boolean;
}

export interface TokenResponse {
  accessToken: string;
}
export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  userInfo: User;
  hasHydrated: boolean;
}

export interface AuthAction {
  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setHydrated: () => void;
}

export interface SignupBody {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthRequest {
  authorizationCode: string;
  provider: string;
}
