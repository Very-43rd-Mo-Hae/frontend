import {StyleSheet} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import {
    socialLoginOptions,
    type SocialLoginOption,
} from '@/features/auth/constants/social-login-options';
import {loginWithSocialProvider} from '@/features/auth/services/social-login';
import {SocialLoginButton} from './social-login-button';
import {getTokenByKakao} from "@/features/auth/services/kakao-login";

export function SocialLoginSection() {
    const handleLoginPress = async (option: SocialLoginOption) => {
        try {
            console.log(`${option.provider} 로그인 테스트를 시작합니다.`);

            const socialLoginResult = await loginWithSocialProvider(option.provider);

            console.log(`${socialLoginResult.provider} 로그인 테스트 성공`, {
                hasAccessToken: Boolean(socialLoginResult.accessToken),
                accessTokenExpiresAt: socialLoginResult.accessTokenExpiresAt,
                refreshTokenExpiresAt: socialLoginResult.refreshTokenExpiresAt,
                scopes: socialLoginResult.scopes,
            });

            const tokenResult = await getTokenByKakao({
                provider: "KAKAO",
                accessToken: socialLoginResult.accessToken
            });

            console.log(`${tokenResult.memberId} 로그인 테스트 성공`)

        } catch (error) {
            console.error(`${option.provider} 로그인 테스트 실패`, error);
        }
    };

    return (
        <ThemedView style={styles.loginSection}>
            <ThemedText type="subtitle" style={styles.title}>
                로그인
            </ThemedText>

            <ThemedView style={styles.buttonGroup}>
                {socialLoginOptions.map((option) => (
                    <SocialLoginButton key={option.provider} option={option} onPress={handleLoginPress}/>
                ))}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
});
