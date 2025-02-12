import { AuthAction, AuthState } from '@/types/auth.type';
import { User } from '@/types/user.type';
import { create } from 'zustand';
import {
  combine,
  devtools,
  persist,
  createJSONStorage,
} from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    persist(
      combine<AuthState, AuthAction>(
        {
          isLoggedIn: false,
          accessToken: '',
          userInfo: {
            email: '',
            name: '',
            nickname: '',
            profileUrl: '',
            userId: 0,
            authProvider: 'plify',
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
              userInfo: user,
            });
            sessionStorage.setItem('@token', token);
          },
          logout: () => {
            set({
              accessToken: '',
              isLoggedIn: false,
              userInfo: {
                authProvider: 'plify',
                name: '',
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
          userInfo: state.userInfo,
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
