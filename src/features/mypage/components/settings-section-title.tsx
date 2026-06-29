import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

export function SettingsSectionTitle() {
    return (
        <div className="mt-6 flex items-center justify-between px-7">
            <h2 className="font-display text-[22px] leading-7 text-relink-gray-700">설정</h2>
            <InlineSvgIcon svg={settingsSvg} label="설정" className="h-[21px] w-[21px]" />
        </div>
    );
}
