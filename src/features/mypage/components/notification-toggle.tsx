type NotificationToggleProps = {
    checked: boolean;
    onChange: () => void;
};

export function NotificationToggle({ checked, onChange }: NotificationToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label="메시지 알림 표시"
            className={`flex h-7 w-14 items-center rounded-full p-1 transition-colors ${
                checked ? 'bg-relink-lavender-intense' : 'bg-relink-gray-200'
            }`}
            onClick={onChange}
        >
            <span
                className={`h-5 w-5 rounded-full bg-relink-white transition-transform ${
                    checked ? 'translate-x-7' : 'translate-x-0'
                }`}
            />
        </button>
    );
}
