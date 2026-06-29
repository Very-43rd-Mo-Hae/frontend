import { useEffect, useState } from 'react';

import { LightningCompleteToast, LightningSetupDialog } from '@/components/common/lightning-setup-dialog';

type FloatingAddButtonPlacement = 'screen' | 'inline';
type FloatingActionKind = 'calendar' | 'friend' | 'group' | 'lightning';

type FloatingAddButtonProps = {
    placement?: FloatingAddButtonPlacement;
};

const quickActions: Array<{ icon: string; label: string; kind: FloatingActionKind }> = [
    { icon: '🗓️', label: '캘린더에서 선택', kind: 'calendar' },
    { icon: '👤', label: '친구부터 고르기', kind: 'friend' },
    { icon: '🫧', label: '그룹 채팅방에 제안', kind: 'group' },
    { icon: '⚡', label: '지금 번개 설정', kind: 'lightning' },
];

const quickQuestions = [
    { icon: '🗓️', label: '비어있는 내 시간을 선택하면, 그 시간에 만날 수 있는 친구를 확인해요.' },
    { icon: '👤', label: '만나고 싶은 친구를 먼저 고르면, 같이 되는 시간을 한 눈에 볼 수 있어요.' },
    { icon: '🫧', label: '기존 그룹 채팅방 멤버에게 일정을 바로 제안해요.' },
    { icon: '⚡', label: '갑자기 시간이 생겼을 때, 지금 당장 만날 수 있는 친구를 찾아요.' },
] as const;

const placementClassNames: Record<
    FloatingAddButtonPlacement,
    {
        root: string;
        overlay: string;
        menu: string;
        button: string;
    }
> = {
    screen: {
        root: '',
        overlay: 'absolute inset-0',
        menu: 'absolute bottom-[146px] right-[20px]',
        button: 'absolute bottom-[76px] right-[27px]',
    },
    inline: {
        root: 'relative h-24 flex-none',
        overlay: 'absolute inset-0',
        menu: 'absolute bottom-[72px] right-0',
        button: 'absolute bottom-0 right-0',
    },
};

export function FloatingAddButton({ placement = 'screen' }: FloatingAddButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isLightningSetupOpen, setIsLightningSetupOpen] = useState(false);
    const [isLightningCompleteVisible, setIsLightningCompleteVisible] = useState(false);
    const classNames = placementClassNames[placement];

    useEffect(() => {
        if (!isLightningCompleteVisible) {
            return undefined;
        }

        const timerId = window.setTimeout(() => {
            setIsLightningCompleteVisible(false);
        }, 1600);

        return () => window.clearTimeout(timerId);
    }, [isLightningCompleteVisible]);

    const closeMenu = () => {
        setIsOpen(false);
        setIsHelpOpen(false);
    };

    const handleActionClick = (kind: FloatingActionKind) => {
        closeMenu();

        if (kind === 'lightning') {
            setIsLightningSetupOpen(true);
        }
    };

    const content = (
        <>
            {isOpen ? (
                <button
                    type="button"
                    className={`${classNames.overlay} z-30 cursor-default bg-transparent`}
                    aria-label="메뉴 닫기"
                    onClick={closeMenu}
                />
            ) : null}

            {isOpen ? (
                <div
                    className={`relink-float-menu ${classNames.menu} z-40 w-[252px] origin-bottom-right rounded-xl bg-relink-white px-5 py-5 shadow-relink-card`}
                >
                    <div className="mb-[22px] flex items-center gap-2">
                        <button
                            type="button"
                            className={`rounded-full border-2 px-3 py-0.5 font-display text-sm transition-colors ${
                                isHelpOpen
                                    ? 'border-relink-lavender-middle text-relink-ink/45'
                                    : 'border-relink-lavender-intense text-relink-ink'
                            }`}
                            aria-pressed={!isHelpOpen}
                            onClick={() => setIsHelpOpen(false)}
                        >
                            약속 잡기
                        </button>
                        <button
                            type="button"
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 bg-transparent font-display text-md transition-colors ${
                                isHelpOpen
                                    ? 'border-relink-lavender-middle text-relink-lavender-middle'
                                    : 'border-relink-lavender-intense text-relink-lavender-intense'
                            }`}
                            aria-label="약속 잡기 도움말"
                            aria-pressed={isHelpOpen}
                            onClick={() => setIsHelpOpen((current) => !current)}
                        >
                            ?
                        </button>
                    </div>

                    {isHelpOpen ? (
                        <ul className="relink-float-menu flex flex-col gap-[18px]">
                            {quickQuestions.map((question) => (
                                <li key={question.label} className="flex items-start gap-2">
                                    <span className="flex w-6 shrink-0 justify-center text-sm" aria-hidden="true">
                                        {question.icon}
                                    </span>
                                    <span className="font-display text-sm text-gray-400">{question.label}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="relink-float-menu flex flex-col gap-[26px]">
                            {quickActions.map((action) => (
                                <li key={action.label}>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-2 bg-transparent p-0 text-left font-display text-md text-relink-ink transition-transform duration-150 ease-out active:scale-[0.98]"
                                        onClick={() => handleActionClick(action.kind)}
                                    >
                                        <span className="flex w-6 shrink-0 justify-center text-sm" aria-hidden="true">
                                            {action.icon}
                                        </span>
                                        <span>{action.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : null}

            {isLightningSetupOpen ? (
                <button
                    type="button"
                    className="fixed inset-0 z-30 cursor-default bg-transparent"
                    aria-label="번개 설정 닫기"
                    onClick={() => setIsLightningSetupOpen(false)}
                />
            ) : null}

            {isLightningSetupOpen ? (
                <LightningSetupDialog
                    className={classNames.menu}
                    onComplete={() => {
                        setIsLightningSetupOpen(false);
                        setIsLightningCompleteVisible(true);
                    }}
                />
            ) : null}

            <button
                type="button"
                aria-label="추가"
                aria-expanded={isOpen}
                className={`${classNames.button} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-relink-lavender-intense transition-transform duration-200 ease-out active:scale-95`}
                onClick={() => {
                    setIsOpen((current) => {
                        if (current) {
                            setIsHelpOpen(false);
                        }

                        return !current;
                    });
                }}
            >
                <span className="relative h-7 w-7" aria-hidden="true">
                    <span
                        className={`absolute left-1/2 top-1/2 h-[5px] w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-white transition-transform duration-300 ease-out ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                    />
                    <span
                        className={`absolute left-1/2 top-1/2 h-7 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-white transition-transform duration-300 ease-out ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                    />
                </span>
            </button>

            {isLightningCompleteVisible ? <LightningCompleteToast className={classNames.menu} /> : null}
        </>
    );

    if (classNames.root) {
        return <div className={classNames.root}>{content}</div>;
    }

    return content;
}
