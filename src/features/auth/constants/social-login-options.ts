import {SocialLoginProvider} from '@/features/auth/types';

export type SocialLoginOption = {
    provider: SocialLoginProvider;
    label: string;
    backgroundColor: string;
    textColor: string;
    borderColor?: string;
};

export const socialLoginOptions = [
    {
        provider: 'KAKAO',
        label: '카카오로 로그인',
        backgroundColor: '#FEE500',
        textColor: '#191919',
    },
    {
        provider: 'GOOGLE',
        label: '구글로 로그인',
        backgroundColor: '#FFFFFF',
        textColor: '#1F1F1F',
        borderColor: '#DADCE0',
    },
    {
        provider: 'APPLE',
        label: 'Apple로 로그인',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
    },
] satisfies SocialLoginOption[];
