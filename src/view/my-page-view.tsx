import { myPageProfile } from '@/features/mypage/my-page-data';
import { MyPageScreen } from '@/features/mypage/components/my-page-screen';

export function MyPageView() {
    return <MyPageScreen profile={myPageProfile} />;
}
