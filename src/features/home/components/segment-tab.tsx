type SegmentTabProps = {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
};

export function SegmentTab({ label, isActive = false, onClick }: SegmentTabProps) {
    return (
        <button
            type="button"
            className={`flex h-[22px] w-[49px] items-center justify-center rounded-[7px] font-display text-sm ${
                isActive
                    ? 'bg-relink-lavender-soft text-relink-ink'
                    : 'bg-transparent text-relink-gray-400'
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
