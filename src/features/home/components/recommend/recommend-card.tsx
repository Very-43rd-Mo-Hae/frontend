import { GenericAvatar } from '@/components/common/nav/generic-avatar';
import {
  ProgressRow,
  type RingSlots,
} from '@/components/common/friend-status';

export type RecommendCardProps = {
  title: string;
  date: string;
  names: readonly string[];
  bars: readonly RingSlots[];
  shadow?: boolean;
};

export function RecommendCard({ title, date, names, bars, shadow = false }: RecommendCardProps) {
  return (
    <article
      className={`h-[240px] w-[180px] rounded border border-relink-card bg-relink-white px-[15px] pt-3.5 ${
        shadow ? 'shadow-relink-card' : ''
      }`}
    >
      <div className="flex h-5 items-center gap-[13px]">
        <h2 className="font-display text-md text-relink-ink">{title}</h2>
        <span className="flex h-5 min-w-[58px] items-center justify-center rounded-full bg-relink-lavender-soft px-2 font-display text-sm text-relink-gray-700">
          약속 잡기
        </span>
      </div>
      <div className="mt-[3px] flex items-center gap-2">
        <p className="font-display text-sm text-relink-gray-700">{date}</p>
        <p className="font-display text-sm text-relink-gray-400">18:00 - 22:00</p>
      </div>

      <div className="relink-hidden-scrollbar mt-3 flex max-h-[192px] flex-col gap-2 overflow-y-auto pr-1">
        {names.map((name, index) => (
          <div key={name} className="flex h-8 shrink-0 flex-col justify-between overflow-y-hidden">
            <div className="flex items-start justify-start gap-1">
              <GenericAvatar size={24} />
              <p className="font-display text-sm text-relink-ink">{name}</p>
            </div>
            <ProgressRow slots={bars[index] ?? []} />
          </div>
        ))}
      </div>
    </article>
  );
}
