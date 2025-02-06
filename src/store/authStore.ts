import { create } from 'zustand';
import {
  combine,
  devtools,
  persist,
  createJSONStorage,
} from 'zustand/middleware';

export interface User {
  email: string;
  nickname: string;
  profileUrl?: string;
  userId: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  user: User;
  hasHydrated: boolean;
}

export interface AuthAction {
  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setHydrated: () => void;
}

const useAuthStore = create(
  devtools(
    persist(
      combine<AuthState, AuthAction>(
        {
          isLoggedIn: false,
          accessToken: '',
          user: {
            email: '',
            nickname: '',
            profileUrl: '',
            userId: 0,
          },
          hasHydrated: false,
        },
        (set) => ({
          setAccessToken: (token: string) => {
            set({ accessToken: token, isLoggedIn: !!token });
          },
          login: (user: User, token: string) => {
            set({
              isLoggedIn: true,
              accessToken: token,
              user: {
                userId: user.userId,
                email: user.email,
                nickname: user.nickname,
                profileUrl: user.profileUrl || '',
              },
            });
            sessionStorage.setItem('@token', token);
          },
          logout: () => {
            set({
              accessToken: '',
              isLoggedIn: false,
              user: {
                email: '',
                nickname: '',
                profileUrl: '',
                userId: 0,
              },
            });
            sessionStorage.removeItem('auth-storage');
            sessionStorage.removeItem('@token');
          },
          setHydrated: () => {
            set({ hasHydrated: true });
          },
        })
      ),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          accessToken: state.accessToken,
          user: state.user,
          hasHydrated: state.hasHydrated,
        }),
        storage: createJSONStorage(() => sessionStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.setHydrated();
          }
        },
      }
    ),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
