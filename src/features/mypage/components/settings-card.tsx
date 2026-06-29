import { useState } from 'react';

import type { MyPageProfile } from '@/features/mypage/types';
import { NotificationToggle } from '@/features/mypage/components/notification-toggle';

type SettingsCardProps = {
    profile: MyPageProfile;
};

export function SettingsCard({ profile }: SettingsCardProps) {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="mx-5 mt-4 rounded-lg bg-relink-white px-8 py-8 shadow-relink-card">
            <div className="flex flex-col gap-4 font-display text-[18px] leading-7 text-relink-gray-400">
                <p>
                    가입경로: <span>{profile.signupProvider}</span>
                </p>
                <p>
                    아이디: <span>{profile.accountId}</span>
                </p>
                <p>
                    이메일: <span>{profile.email}</span>
                </p>
            </div>

            <div className="my-7 h-px bg-relink-gray-200" />

            <div>
                <p className="mb-3 font-display text-[18px] leading-7 text-relink-gray-400">알림 설정</p>
                <div className="flex items-center gap-4">
                    <span aria-hidden="true" className="font-sans text-3xl leading-none text-relink-lavender-intense">
                        ♡
                    </span>
                    <NotificationToggle
                        checked={isNotificationEnabled}
                        onChange={() => setIsNotificationEnabled((current) => !current)}
                    />
                </div>
            </div>

            <div className="my-7 h-px bg-relink-gray-200" />

            <div>
                <p className="mb-4 font-display text-[18px] leading-7 text-relink-gray-400">기타 설정</p>
                <button
                    type="button"
                    aria-expanded={isExpanded}
                    className="w-full rounded-lg bg-relink-lavender-soft py-4 font-display text-[18px] leading-6 text-relink-gray-400"
                    onClick={() => setIsExpanded((current) => !current)}
                >
                    {isExpanded ? '접기' : '펼치기'}
                </button>

                {isExpanded ? (
                    <div className="mt-6 flex flex-col gap-4 border-t border-relink-gray-200 pt-6">
                        <button
                            type="button"
                            className="text-left font-display text-[18px] leading-7 text-relink-gray-400"
                        >
                            로그아웃
                        </button>
                        <button
                            type="button"
                            className="text-left font-display text-[18px] leading-7 text-relink-rose"
                        >
                            비활성화
                        </button>
                        <p className="rounded-lg bg-relink-lavender-soft px-4 py-4 text-center font-display text-md text-relink-rose">
                            30일 뒤 계정이 영구적으로 삭제됩니다. 영구 삭제 이전, 언제나 로그인하여 계정을 재활성화할 수 있습니다.
                        </p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
