'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useAuthMutation } from '@/hooks/queries/auth.query';
import LoadingSpinner from '@/app/components/Common/LoadingSpinner';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const provider =
    typeof params.provider === 'string'
      ? params.provider
      : Array.isArray(params.provider)
      ? params.provider[0]
      : '';

  const code = searchParams.get('code');

  const authMutation = useAuthMutation();
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (code && provider && !hasCalledRef.current) {
      hasCalledRef.current = true;
      authMutation.mutate({
        authorizationCode: code,
        provider: provider,
      });
    }
  }, [code, provider, authMutation]);

  return <LoadingSpinner />;
}
