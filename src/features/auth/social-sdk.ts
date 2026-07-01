type KakaoAuthResponse = {
    access_token: string;
};

type KakaoSdk = {
    init: (javascriptKey: string) => void;
    isInitialized: () => boolean;
    Auth: {
        login: (options: {
            scope?: string;
            success: (response: KakaoAuthResponse) => void;
            fail: (error: unknown) => void;
        }) => void;
    };
};

type GoogleCredentialResponse = {
    credential?: string;
};

type GoogleSdk = {
    accounts: {
        id: {
            initialize: (options: {
                client_id: string;
                callback: (response: GoogleCredentialResponse) => void;
            }) => void;
            renderButton: (
                parent: HTMLElement,
                options: {
                    theme: 'outline' | 'filled_blue' | 'filled_black';
                    size: 'large' | 'medium' | 'small';
                    shape: 'pill' | 'rectangular' | 'circle' | 'square';
                    width?: number;
                    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                },
            ) => void;
        };
    };
};

declare global {
    interface Window {
        Kakao?: KakaoSdk;
        google?: GoogleSdk;
    }
}

const kakaoJavascriptKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function hasKakaoConfig() {
    return Boolean(kakaoJavascriptKey);
}

export function hasGoogleConfig() {
    return Boolean(googleClientId);
}

export async function requestKakaoAccessToken() {
    if (!kakaoJavascriptKey) {
        throw new Error('카카오 JavaScript 키가 설정되지 않았습니다.');
    }

    await loadScript('https://developers.kakao.com/sdk/js/kakao.min.js');

    if (!window.Kakao) {
        throw new Error('카카오 SDK를 불러오지 못했습니다.');
    }

    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoJavascriptKey);
    }

    return new Promise<string>((resolve, reject) => {
        window.Kakao?.Auth.login({
            scope: 'account_email',
            success: (response) => resolve(response.access_token),
            fail: reject,
        });
    });
}

export async function renderGoogleLoginButton(container: HTMLElement, onCredential: (idToken: string) => void) {
    if (!googleClientId) {
        return;
    }

    await loadScript('https://accounts.google.com/gsi/client');

    window.google?.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
            if (response.credential) {
                onCredential(response.credential);
            }
        },
    });

    container.replaceChildren();
    window.google?.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 300,
        text: 'continue_with',
    });
}

function loadScript(src: string) {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existingScript?.dataset.loaded === 'true') {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const script = existingScript ?? document.createElement('script');

        script.src = src;
        script.async = true;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = () => reject(new Error(`${src} 스크립트를 불러오지 못했습니다.`));

        if (!existingScript) {
            document.head.appendChild(script);
        }
    });
}
