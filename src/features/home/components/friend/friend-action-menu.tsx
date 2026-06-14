const friendActions = [
  { icon: '🔗', label: '약속 잡기' },
  { icon: '🧠', label: '관계 마인드맵' },
  { icon: '💬', label: '1:1 채팅' },
  { icon: '🤫', label: '숨기기 설정' },
  { icon: '🫧', label: '새 그룹 채팅' },
  { icon: '⛔', label: '친구 차단' },
] as const;

export function FriendActionMenu() {
  return (
    <nav
      className="w-[200px] rounded-lg bg-relink-white px-5 py-[19px] shadow-relink-card"
      aria-label="친구 액션"
    >
      <ul className="flex flex-col gap-[19px]">
        {friendActions.map((action) => (
          <li key={action.label}>
            <button
              type="button"
              className="flex w-full items-center gap-2 bg-transparent p-0 text-left font-display text-lg text-relink-ink"
            >
              <span className="flex w-6 shrink-0 justify-center text-md" aria-hidden="true">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
