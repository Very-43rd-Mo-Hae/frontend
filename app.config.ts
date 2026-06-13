import type { ExpoConfig } from 'expo/config';

const kakaoNativeAppKey = process.env.KAKAO_NATIVE_APP_KEY;
const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID;
const googleIosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME;

if (!kakaoNativeAppKey) {
  throw new Error('KAKAO_NATIVE_APP_KEY 환경변수가 설정되어 있지 않습니다.');
}

const config: ExpoConfig = {
  name: 'relink_frontend',
  slug: 'relink_frontend',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'relinkfrontend',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: 'com.chyun7114.relinkfrontend'
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.chyun7114.relink_frontend',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    './plugins/with-android-gradle-fix',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: kakaoNativeAppKey,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    googleIosUrlScheme
      ? [
          '@react-native-google-signin/google-signin',
          {
            iosUrlScheme: googleIosUrlScheme,
          },
        ]
      : '@react-native-google-signin/google-signin',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '31897949-f739-4822-87e3-60fc00c0b3aa',
    },
    kakaoNativeAppKey,
    kakaoNativeAppKeyConfigured: true,
    googleWebClientId,
    googleWebClientIdConfigured: Boolean(googleWebClientId),
  },
};

export default config;
