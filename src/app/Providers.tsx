'use client'; // ✅ 클라이언트 컴포넌트로 지정

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()); // ✅ useState로 QueryClient 인스턴스를 생성

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
