import {StyleSheet} from "react-native";

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {Spacing} from "@/constants/theme";
import {
    socialLoginOptions,
    type SocialLoginOption,
} from "@/features/auth/constants/social-login-options";
import {loginWithSocialProvider} from "@/features/auth/services/social-login";
import {SocialLoginButton} from "./social-login-button";

export function SocialLoginSection() {
    const handleLoginPress = async (option: SocialLoginOption) => {
        try {
            console.log(`${option.provider} 로그인을 시작합니다.`);

            await loginWithSocialProvider(option.provider);

            console.log(`${option.provider} 로그인이 완료되었습니다.`);
        } catch (error) {
            console.error(`${option.provider} 로그인에 실패했습니다.`, error);
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
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: Spacing.four,
        gap: Spacing.five,
        width: "100%",
    },
    title: {
        textAlign: "center",
    },
    buttonGroup: {
        gap: Spacing.three,
        width: "100%",
        maxWidth: 360,
    },
});
