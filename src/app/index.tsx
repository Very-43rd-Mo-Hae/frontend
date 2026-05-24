import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { loginWithSocialProvider } from '@/features/auth/services/social-login';
import { SocialLoginProvider } from '@/features/auth/types';

const loginOptions = [
  {
    provider: 'kakao',
    label: '카카오로 로그인',
    backgroundColor: '#FEE500',
    textColor: '#191919',
  },
  {
    provider: 'google',
    label: '구글로 로그인',
    backgroundColor: '#FFFFFF',
    textColor: '#1F1F1F',
    borderColor: '#DADCE0',
  },
  {
    provider: 'apple',
    label: 'Apple로 로그인',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
] satisfies {
  provider: SocialLoginProvider;
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}[];

export default function HomeScreen() {
  const handleLoginPress = async (provider: SocialLoginProvider) => {
    try {
      console.log(`${provider} 로그인 테스트를 시작합니다.`);

      const result = await loginWithSocialProvider(provider);

      console.log(`${result.provider} 로그인 테스트 성공`, {
        accessTokenExpiresAt: result.accessTokenExpiresAt,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
        scopes: result.scopes,
      });
    } catch (error) {
      console.error(`${provider} 로그인 테스트 실패`, error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.loginSection}>
          <ThemedText type="subtitle" style={styles.title}>
            로그인
          </ThemedText>

          <ThemedView style={styles.buttonGroup}>
            {loginOptions.map((option) => (
              <Pressable
                accessibilityRole="button"
                key={option.label}
                onPress={() => handleLoginPress(option.provider)}
                style={({ pressed }) => [
                  styles.loginButton,
                  {
                    backgroundColor: option.backgroundColor,
                    borderColor: option.borderColor ?? option.backgroundColor,
                    opacity: pressed ? 0.82 : 1,
                  },
                ]}>
                <ThemedText
                  type="smallBold"
                  style={[styles.loginButtonText, { color: option.textColor }]}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  loginSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
  buttonGroup: {
    gap: Spacing.three,
    width: '100%',
    maxWidth: 360,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
  },
  loginButtonText: {
    textAlign: 'center',
  },
});
