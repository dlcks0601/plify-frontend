import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface Message {
  code: number;
  text: string;
}

interface RefreshResopnse {
  message: Message;
  accessToken: string;
}

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // 필요 시 쿠키 등 전달
});

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('accessToken');
}

function setAccessToken(newToken: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('accessToken', newToken);
}

function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const userInfoStr = localStorage.getItem('userInfo');
  if (!userInfoStr) return null;
  try {
    const userInfo = JSON.parse(userInfoStr);
    return userInfo?.userId ?? null;
  } catch (error) {
    return null;
  }
}

async function refreshAccessToken(
  originalRequest: AxiosRequestConfig
): Promise<AxiosResponse | undefined> {
  const userId = getUserId();
  if (!userId) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // 로그아웃 처리 혹은 로그인 페이지로 이동
    }
    return;
  }

  try {
    const refreshUrl = `${baseURL}/auth/refresh`;
    const { data } = await axios.post<RefreshResopnse>(
      refreshUrl,
      { userId },
      { withCredentials: true }
    );

    setAccessToken(data.accessToken);

    // 재발급 받은 토큰을 헤더에 설정하여 요청 재시도
    const newConfig: AxiosRequestConfig = {
      ...originalRequest,
      headers: {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
    };
    return axiosInstance.request(newConfig);
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // 로그아웃 처리 혹은 로그인 페이지로 이동
    }
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 정상 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;
    if (response?.status === 401 && config) {
      console.error('❗ 인증 오류 발생:', response.data);
      // 토큰 재발급 시도
      return refreshAccessToken(config);
    }
    // 그 외 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default axiosInstance;
