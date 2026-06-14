type ActiveLightningBadgeProps = {
  color: string;
};

export function ActiveLightningBadge({ color }: ActiveLightningBadgeProps) {
  return (
    <svg
      width="18"
      height="27"
      viewBox="0 0 22 33"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_2px_1px_rgba(0,226,234,0.55)]"
    >
      <path
        d="M13.5563 2.62542C14.2329 1.87714 15.4661 2.48782 15.281 3.47953L12.9501 15.9719C12.8618 16.4452 12.4487 16.7884 11.9671 16.7884H3.00198C2.1351 16.7884 1.67883 15.7607 2.26025 15.1177L13.5563 2.62542Z"
        fill={color}
      />
      <path
        d="M7.94283 28.4942C7.26621 29.2425 6.03303 28.6318 6.21807 27.6401L8.54894 15.1478C8.63727 14.6744 9.05043 14.3312 9.53198 14.3312L18.4971 14.3312C19.364 14.3312 19.8203 15.3589 19.2388 16.0019L7.94283 28.4942Z"
        fill={color}
      />
    </svg>
  );
}
