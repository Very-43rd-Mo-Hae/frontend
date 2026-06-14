import { useState } from 'react';

import { HelpBadge } from '@/components/common/nav/help-badge';

const quickActions = [
  { icon: '🗓️', label: '캘린더에서 선택' },
  { icon: '👤', label: '친구부터 고르기' },
  { icon: '🫧', label: '그룹 채팅방에 제안' },
  { icon: '⚡', label: '지금 번개 설정' },
] as const;

const quickQuestions = [
  { icon: '🗓️', label: '비어있는 내 시간을 선택하면, 그 시간에 만날 수 있는 친구를 확인해요.' },
  { icon: '👤', label: '만나고 싶은 친구를 먼저 고르면, 같이 되는 시간을 한 눈에 볼 수 있어요.' },
  { icon: '🫧', label: '기존 그룹 채팅방 멤버에게 일정을 바로 제안해요.' },
  { icon: '⚡', label: '갑자기 시간이 생겼을 때, 지금 당장 만날 수 있는 친구를 찾아요.' },
] as const;

export function FloatingAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    setIsHelpOpen(false);
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="absolute inset-0 z-30 cursor-default bg-transparent"
          aria-label="메뉴 닫기"
          onClick={closeMenu}
        />
      )}

      {isOpen && (
        <div className="relink-float-menu absolute bottom-[146px] right-[20px] z-40 w-[252px] origin-bottom-right rounded-xl bg-relink-white px-5 py-5 shadow-relink-card">
          <div className="mb-[22px] flex items-center gap-2">
            <span className="rounded-full border-2 border-relink-lavender-intense px-3 py-0.5 font-display text-sm text-relink-ink">
              약속 잡기
            </span>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center bg-transparent font-display text-md text-relink-lavender-intense"
              aria-label="약속 잡기 도움말"
              aria-pressed={isHelpOpen}
              onClick={() => setIsHelpOpen((current) => !current)}
            >
              <HelpBadge size={20} />
            </button>
          </div>

          {isHelpOpen ? (
            <ul className="relink-float-menu flex flex-col gap-[18px]">
              {quickQuestions.map((question) => (
                <li key={question.label} className="flex items-start gap-2">
                  <span className="flex w-6 shrink-0 justify-center text-sm" aria-hidden="true">
                    {question.icon}
                  </span>
                  <span className="font-display text-sm text-gray-400">
                    {question.label}
                  </span>
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
                    onClick={closeMenu}
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
      )}

      <button
        type="button"
        aria-label="추가"
        aria-expanded={isOpen}
        className="absolute bottom-[76px] right-[27px] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-relink-lavender-intense transition-transform duration-200 ease-out active:scale-95"
        onClick={() => {
          setIsOpen((current) => {
            if (current) {
              setIsHelpOpen(false);
            }

            return !current;
          });
        }}
      >
        <span
          className={`text-xl font-semibold text-relink-white transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>
    </>
  );
}
