type SegmentTabProps = {
  label: string;
};

export function SegmentTab({ label }: SegmentTabProps) {
  return (
    <button
      type="button"
      className="flex h-[22px] w-[49px] items-center justify-center rounded-[7px] bg-relink-lavender-soft font-display text-sm text-relink-ink"
    >
      {label}
    </button>
  );
}
