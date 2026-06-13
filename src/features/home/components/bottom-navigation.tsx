import calendarIcon from '../../../../assets/icons/calendar.svg';
import chatIcon from '../../../../assets/icons/chat.svg';
import friendsIcon from '../../../../assets/icons/friends.svg';
import homeIcon from '../../../../assets/icons/home.svg';
import mypageIcon from '../../../../assets/icons/mypage.svg';

type BottomNavigationItem = {
  label: string;
  source: string;
  width: number;
  height: number;
};

const navigationItems: BottomNavigationItem[] = [
  { label: '홈', source: homeIcon, width: 43, height: 35 },
  { label: '캘린더', source: calendarIcon, width: 34, height: 36 },
  { label: '친구', source: friendsIcon, width: 35, height: 35 },
  { label: '채팅', source: chatIcon, width: 34, height: 34 },
  { label: '마이페이지', source: mypageIcon, width: 31, height: 31 },
];

export function BottomNavigation() {
  return (
    <nav className=" fixed z-50 absolute bottom-[7px] left-0 right-0 flex h-[62px] items-center justify-center gap-[35px] bg-relink-white">
      {navigationItems.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-label={item.label}
          className="flex h-[43px] w-[43px] items-center justify-center">
          <img
            src={item.source}
            alt=""
            aria-hidden="true"
            className="block object-contain"
            style={{ width: item.width, height: item.height }}
          />
        </button>
      ))}
    </nav>
  );
}
