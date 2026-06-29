import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import logoImage from '@/assets/images/logo.png';
import { loginWithGoogleIdToken, loginWithKakaoAccessToken } from '@/api/auth';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { routePaths } from '@/constants/route-paths';
import {
    hasGoogleConfig,
    hasKakaoConfig,
    renderGoogleLoginButton,
    requestKakaoAccessToken,
} from '@/features/auth/social-sdk';

type LoginLocationState = {
    from?: string;
};

export function LoginView() {
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [isKakaoLoading, setIsKakaoLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const from = (location.state as LoginLocationState | null)?.from ?? routePaths.home;

    useEffect(() => {
        const container = googleButtonRef.current;

        if (!container) {
            return;
        }

        renderGoogleLoginButton(container, async (idToken) => {
            setIsGoogleLoading(true);
            setErrorMessage(null);

            try {
                await loginWithGoogleIdToken(idToken);
                navigate(from, { replace: true });
            } catch {
                setErrorMessage('구글 로그인에 실패했습니다.');
            } finally {
                setIsGoogleLoading(false);
            }
        }).catch(() => {
            setErrorMessage('구글 로그인을 준비하지 못했습니다.');
        });
    }, [from, navigate]);

    const handleKakaoLogin = async () => {
        setIsKakaoLoading(true);
        setErrorMessage(null);

        try {
            const accessToken = await requestKakaoAccessToken();
            await loginWithKakaoAccessToken(accessToken);
            navigate(from, { replace: true });
        } catch {
            setErrorMessage('카카오 로그인에 실패했습니다.');
        } finally {
            setIsKakaoLoading(false);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col bg-relink-white px-8 pb-10 pt-16 font-display">
            <main className="flex flex-1 flex-col items-center justify-center gap-8">
                <img src={logoImage} alt="Relink" className="h-24 w-24 rounded-2xl object-contain" />

                <div className="text-center">
                    <h1 className="text-3xl text-relink-ink">Relink</h1>
                    <p className="mt-3 font-sans text-sm leading-6 text-relink-gray-500">
                        친구와 약속 가능한 시간을 빠르게 맞춰보세요.
                    </p>
                </div>

                <div className="flex w-full flex-col items-center gap-3">
                    <button
                        type="button"
                        disabled={!hasKakaoConfig() || isKakaoLoading || isGoogleLoading}
                        onClick={handleKakaoLogin}
                        className="flex h-10 w-full max-w-[300px] items-center justify-center rounded-full bg-[#FEE500] px-5 font-sans text-sm font-semibold text-[#191919] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isKakaoLoading ? '카카오 로그인 중' : '카카오로 계속하기'}
                    </button>

                    <div
                        ref={googleButtonRef}
                        className={hasGoogleConfig() ? 'flex h-10 w-full max-w-[300px] justify-center overflow-hidden rounded-full' : 'hidden'}
                    />

                    {!hasGoogleConfig() ? (
                        <button
                            type="button"
                            disabled
                            className="flex h-10 w-full max-w-[300px] items-center justify-center rounded-full border border-relink-gray-200 bg-relink-white px-5 font-sans text-sm font-semibold text-relink-gray-400"
                        >
                            구글 로그인 설정 필요
                        </button>
                    ) : null}
                </div>

                {errorMessage ? (
                    <p role="alert" className="rounded bg-relink-lavender-soft px-4 py-3 font-sans text-sm text-relink-ink">
                        {errorMessage}
                    </p>
                ) : null}
            </main>

            {isKakaoLoading || isGoogleLoading ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-relink-white/75 backdrop-blur-[1px]">
                    <LoadingSpinner label={isKakaoLoading ? '카카오 로그인 중' : '구글 로그인 중'} size={48} />
                </div>
            ) : null}
        </div>
    );
}
