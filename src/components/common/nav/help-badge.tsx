import helpIcon from '@/assets/icons/help-icon.svg';

type HelpBadgeProps = {
  size?: number;
};

const HelpBadge = ({ size = 15 }: HelpBadgeProps) => {
  return (
      <img
          src={helpIcon}
          alt="도움말"
          className="ml-auto object-contain"
          style={{ width: size, height: size }}
      />
  );
};

export { HelpBadge };