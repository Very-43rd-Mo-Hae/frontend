import { login } from '@react-native-kakao/user';

import { SocialLoginResult } from '@/features/auth/types';

export async function loginWithKakao(): Promise<SocialLoginResult> {
  const token = await login();

  return {
    provider: 'kakao',
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scopes: token.scopes,
  };
}
