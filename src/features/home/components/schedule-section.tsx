import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    fetchUpcomingAppointments,
    type UpcomingAppointment,
} from '@/api/appointments';
import genericProfileSvg from '@/assets/icons/generic-avatar.svg';
import { routePaths } from '@/constants/route-paths';
import { ScheduleCard, type ScheduleCardProps } from '@/features/home/components/schedule/schedule-card';

const UPCOMING_APPOINTMENT_LIMIT = 5;

function toScheduleCardProps(appointment: UpcomingAppointment): ScheduleCardProps {
    const startAt = new Date(appointment.startAt);
    const endAt = new Date(appointment.endAt);

    return {
        title: appointment.title,
        location: appointment.memo?.trim() || '장소 미정',
        time: `${formatTime(startAt)}-${formatTime(endAt)}`,
        date: formatDate(startAt),
        groupImageSvg: genericProfileSvg,
        memberCount: Math.max(appointment.participants.length, 1),
    };
}

function formatTime(date: Date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return `${year}.${month}.${day} (${weekDays[date.getDay()]})`;
}

function EmptyAppointmentMessageCard() {
    return (
        <article className="flex h-[98px] items-center justify-center rounded border border-relink-card bg-relink-white shadow-relink-card">
            <p className="font-display text-md text-gray-400">약속이 없습니다.</p>
        </article>
    );
}

function EmptyAppointmentActionCard() {
    const navigate = useNavigate();

    const moveToScheduleAppointment = () => {
        navigate(routePaths.appointmentSchedule);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            moveToScheduleAppointment();
        }
    };

    return (
        <article className="flex h-[98px] items-center justify-center rounded border border-relink-card bg-relink-lavender-soft shadow-relink-card">
            <div
                role="button"
                tabIndex={0}
                aria-label="스케줄로 약속 잡기"
                className="relative h-[46px] w-[46px] cursor-pointer rounded-full border-[4px] border-relink-lavender-intense bg-relink-white transition-transform active:scale-95"
                onClick={moveToScheduleAppointment}
                onKeyDown={handleKeyDown}
            >
                <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[23px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-lavender-intense"
                />
                <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[5px] w-[23px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-lavender-intense"
                />
            </div>
        </article>
    );
}

export function ScheduleSection() {
    const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetchUpcomingAppointments(UPCOMING_APPOINTMENT_LIMIT)
            .then((nextAppointments) => {
                if (isMounted) {
                    setAppointments(nextAppointments);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setAppointments([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="flex flex-col gap-2 font-display">
            <p className="text-lg pb-2 text-gray-700">다가오는 약속</p>
            {isLoading ? (
                <p className="rounded border border-relink-card bg-relink-white px-4 py-8 text-center text-md text-gray-400 shadow-relink-card">
                    약속을 불러오는 중
                </p>
            ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                    <ScheduleCard key={appointment.appointmentId} {...toScheduleCardProps(appointment)} />
                ))
            ) : (
                <>
                    <EmptyAppointmentMessageCard />
                    <EmptyAppointmentActionCard />
                </>
            )}
        </section>
    );
}
