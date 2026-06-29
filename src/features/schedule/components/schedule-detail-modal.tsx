import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { ScheduledBlock } from '@/features/schedule/types';

type ScheduleDetailModalProps = {
    schedule: ScheduledBlock;
    onClose: () => void;
};

export function ScheduleDetailModal({ schedule, onClose }: ScheduleDetailModalProps) {
    const location = schedule.location || '장소';
    const memo = schedule.memo || '메모';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            role="presentation"
            onClick={onClose}
        >
            <article
                className="relative flex w-full max-w-[338px] items-start justify-between gap-3 rounded-md bg-relink-white py-4 pl-[18px] pr-[15px] shadow-relink-card"
                role="dialog"
                aria-modal="true"
                aria-label={`${schedule.title} 일정 상세`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="truncate font-display text-lg text-relink-gray-700">{schedule.title}</h2>
                        <p className="shrink-0 pt-0.5 font-display text-md text-relink-gray-700">
                            {formatHour(schedule.startHour)} ~ {formatHour(schedule.endHour)}
                        </p>
                    </div>

                    <div className="mt-1.5 flex min-w-0 items-center gap-1.5 font-display text-md text-relink-gray-500">
                        <span aria-hidden="true">📍</span>
                        <span className="truncate">{location}</span>
                    </div>

                    <div className="mt-1.5 flex min-w-0 items-center gap-1.5 font-display text-md text-relink-gray-400">
                        <span aria-hidden="true">📝</span>
                        <span className="truncate">{memo}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="absolute bottom-[17px] right-[15px] flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-relink-lavender-soft"
                    aria-label="일정 설정"
                >
                    <InlineSvgIcon svg={settingsSvg} className="h-[21px] w-[21px]" />
                </button>
            </article>
        </div>
    );
}

function formatHour(time: number) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}`;
}
