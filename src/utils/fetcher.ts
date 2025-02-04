import axiosInstance from '@/apis/@core';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetcherOptions {
  url: string;
  method: HttpMethod;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface FetcherMessage {
  text?: string;
}

const fetcher = async <T>(options: FetcherOptions): Promise<T> => {
  const { url, method, data, params, headers } = options;

  try {
    const response = await axiosInstance<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error: any) {
    // ✅ 서버의 에러 메시지를 콘솔에 표시
    if (error.response) {
      console.error('❌ API 오류:', error.response.data.message);
      throw new Error(error.response.data.message); // 상세한 오류 반환
    } else {
      console.error('❌ 요청 실패:', error.message);
      throw new Error('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    }
  }
};

export default fetcher;
