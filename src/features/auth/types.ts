export type SocialLoginProvider = 'kakao' | 'google' | 'apple';

export type SocialLoginResult = {
  provider: SocialLoginProvider;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
  scopes?: string[];
};
