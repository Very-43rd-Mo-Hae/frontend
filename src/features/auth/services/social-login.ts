import { loginWithKakao } from '@/features/auth/services/kakao-login';
import { SocialLoginProvider, SocialLoginResult } from '@/features/auth/types';

export async function loginWithSocialProvider(
  provider: SocialLoginProvider,
): Promise<SocialLoginResult> {
  switch (provider) {
    case 'kakao':
      return loginWithKakao();
    case 'google':
    case 'apple':
      throw new Error(`${provider} 로그인은 아직 준비 중입니다.`);
    default:
      throw new Error('지원하지 않는 로그인 방식입니다.');
  }
}
