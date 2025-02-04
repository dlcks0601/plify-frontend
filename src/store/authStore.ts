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
  id: number;
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

const useAuthStore = create(
  devtools(
    persist(
      combine<AuthState, AuthAction>(
        {
          isLoggedIn: false,
          accessToken: '',
          userInfo: {
            email: '',
            nickname: '',
            profileUrl: '',
            id: 0,
          },
          hasHydrated: false, // hydration 여부 플래그 추가
        },
        (set) => ({
          setAccessToken: (token: string) => {
            set({ accessToken: token, isLoggedIn: !!token });
          },
          login: (user: User, token: string) => {
            set({
              isLoggedIn: true,
              accessToken: token,
              userInfo: user,
            });
          },
          logout: () => {
            set({
              accessToken: '',
              isLoggedIn: false,
              userInfo: {
                email: '',
                nickname: '',
                profileUrl: '',
                id: 0,
              },
            });
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
          userInfo: state.userInfo,
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
